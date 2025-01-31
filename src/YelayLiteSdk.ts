import { ethers } from 'ethers';
import { ERC20__factory } from './../typechain/generated/factories/ERC20__factory';
import { IYelayLiteVault__factory } from './../typechain/generated/factories/IYelayLiteVault__factory';
import { LibErrors__factory } from './../typechain/generated/factories/LibErrors__factory';
import { VaultWrapper__factory } from './../typechain/generated/factories/VaultWrapper__factory';
import { contracts } from './constants';
import {
	CallResult,
	ClientData,
	ProjectYield,
	TimeFrame,
	UserYield,
	UserYieldAggregatedData,
	Vault,
	VaultYield,
	YelayLiteSdkConfig,
} from './types';

export class YelayLiteSdk {
	private backendUrl: string;
	private provider: ethers.providers.JsonRpcProvider;
	private _chainId: number | undefined;

	constructor(private readonly config: YelayLiteSdkConfig) {
		this.backendUrl = config.backendUrl;
		this.provider = config.provider;
	}

	async #chainId() {
		if (!this._chainId) {
			this._chainId = (await this.provider.getNetwork()).chainId;
		}
		return this._chainId;
	}

	/**
	 * Retrieves a list of all vaults.
	 * @returns {Promise<Vault[]>} A promise that resolves to an array of vault objects.
	 */
	async getVaults(): Promise<Vault[]> {
		const chainId = await this.#chainId();
		const q = new URLSearchParams({ chainId: chainId.toString() }).toString();
		const res = await fetch(`${this.backendUrl}/vaults?${q}`);
		const vaults = await res.json();
		return vaults;
	}

	/**
	 * Retrieves the yield of the vaults.
	 * @param {string[]} vaults - The addresses of the vaults.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<VaultYield[]>} A promise that resolves to the yield data for the vaults.
	 */
	async getVaultsYield(vaults: string[], timeFrame?: TimeFrame): Promise<VaultYield[]> {
		const q = new URLSearchParams();
		vaults.forEach(v => q.append('address', v.toString()));
		this.#appendTimeFrameQuery(q, timeFrame);
		const res = await fetch(`${this.backendUrl}/interest/vaults?${q.toString()}`);
		return await res.json();
	}

	/**
	 * Retrieves the yield for specific projects within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number[]} projectIds - Array of project IDs to query.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<ProjectYield[]>} A promise that resolves to an array of project yield data.
	 */
	async getProjectsYield(vault: string, projectIds: number[], timeFrame?: TimeFrame): Promise<ProjectYield[]> {
		const q = new URLSearchParams();
		projectIds.forEach(p => q.append('id', p.toString()));
		this.#appendTimeFrameQuery(q, timeFrame);
		const res = await fetch(`${this.backendUrl}/interest/vault/${vault}/projects?${q.toString()}`);
		return await res.json();
	}

	/**
	 * Retrieves the total value locked (TVL) for specific projects within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number[]} projectIds - Array of project IDs to query.
	 * @returns {Promise<ethers.BigNumber[]>} A promise that resolves to an array of TVL values for each project.
	 */
	async getProjectsTvl(vault: string, projectIds: number[]): Promise<ethers.BigNumber[]> {
		const yelayLiteVault = IYelayLiteVault__factory.connect(vault, this.provider);
		const [totalAssets, totalSupply, ...projectsSupply] = await Promise.all([
			yelayLiteVault.totalAssets(),
			yelayLiteVault['totalSupply()'](),
			...projectIds.map(p => yelayLiteVault['totalSupply(uint256)'](p)),
		]);
		return projectsSupply.map(s => totalAssets.mul(s).div(totalSupply));
	}

	/**
	 * Retrieves the yield for specific users within a project in a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The project ID.
	 * @param {string[]} users - Array of user addresses to query.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<UserYield[]>} A promise that resolves to an array of user yield data.
	 */
	async getUsersYield(
		vault: string,
		projectId: number,
		users: string[],
		timeFrame?: TimeFrame,
	): Promise<UserYield[]> {
		const q = new URLSearchParams();
		users.forEach(p => q.append('user', p.toString()));
		this.#appendTimeFrameQuery(q, timeFrame);
		const res = await fetch(
			`${this.backendUrl}/interest/vault/${vault}/project/${projectId}/users?${q.toString()}`,
		);
		return await res.json();
	}

	/**
	 * Retrieves the aggregated yield data for a specific user across multiple projects and vaults.
	 *
	 * @param {string} user - The address of the user whose yield data is being queried.
	 * @param {string[]} [vaults] - Optional array of vault addresses to filter the query.
	 * @param {number[]} [projectIds] - Optional array of projectIds to filter the query.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe to filter the yield data by specific dates or blocks.
	 * @returns {Promise<UserYieldAggregatedData[]>} A promise that resolves to an array of aggregated yield data,
	 * each containing vault address and a mapping of project IDs to yield values.
	 */
	async getUserYield(
		user: string,
		vaults?: string[],
		projectIds?: number[],
		timeFrame?: TimeFrame,
	): Promise<UserYieldAggregatedData[]> {
		const q = new URLSearchParams();
		vaults?.forEach(v => q.append('v', v.toLowerCase()));
		projectIds?.forEach(p => q.append('v', p.toString()));
		this.#appendTimeFrameQuery(q, timeFrame);
		const res = await fetch(`${this.backendUrl}/interest/user/${user}?${q.toString()}`);
		return await res.json();
	}

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {ethers.Signer} signer - The signer object for the user.
	 * @param {string} vault - The address of the vault contract.
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	async allowance(signer: ethers.Signer, vault: string): Promise<ethers.BigNumber> {
		const underlying = await IYelayLiteVault__factory.connect(vault, this.provider).underlyingAsset();
		const userAddress = await signer.getAddress();
		return ERC20__factory.connect(underlying, this.provider).allowance(userAddress, vault);
	}

	/**
	 * Approves the vault to spend a specified amount of tokens on behalf of the user.
	 * @param {ethers.Signer} signer - The signer object for the user.
	 * @param {string} vault - The address of the vault.
	 * @param {bigint} amount - The amount to approve.
	 * @returns {Promise<CallResult>} A promise that resolves to the result of the approval transaction.
	 */
	async approve(signer: ethers.Signer, vault: string, amount: bigint): Promise<CallResult> {
		const yelayLiteVault = IYelayLiteVault__factory.connect(vault, signer);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();
		return this.#tryCall(ERC20__factory.connect(underlyingAsset, signer).approve(vault, amount));
	}

	/**
	 * Deposits a specified amount into a project in the vault.
	 * @param {ethers.Signer} signer - The signer object for the user.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The project ID.
	 * @param {bigint} amount - The amount to deposit.
	 * @returns {Promise<CallResult>} A promise that resolves to the result of the deposit transaction.
	 */
	async deposit(signer: ethers.Signer, vault: string, projectId: number, amount: bigint): Promise<CallResult> {
		const userAddress = await signer.getAddress();
		return this.#tryCall(IYelayLiteVault__factory.connect(vault, signer).deposit(amount, projectId, userAddress));
	}

	/**
	 * Deposits a specified amount of ETH into a project in the vault.
	 * @param {ethers.Signer} signer - The signer object for the user.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The project ID.
	 * @param {bigint} amount - The amount of ETH to deposit (in wei).
	 * @returns {Promise<CallResult>} A promise that resolves to the result of the deposit transaction.
	 *
	 * This method wraps the specified ETH amount and deposits it into the target vault for the given project.
	 * It uses the VaultWrapper contract to handle ETH wrapping and depositing in a single transaction.
	 */
	async depositEth(signer: ethers.Signer, vault: string, projectId: number, amount: bigint): Promise<CallResult> {
		const chainId = (await signer.provider!.getNetwork()).chainId;
		const vaultWrapper = VaultWrapper__factory.connect(contracts[Number(chainId)].vaultWrapper, signer);
		return this.#tryCall(vaultWrapper.wrapEthAndDeposit(vault, projectId, { value: amount }));
	}

	/**
	 * Withdraws a specified amount from a project in the vault.
	 * @param {ethers.Signer} signer - The signer object for the user.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The project ID.
	 * @param {bigint} amount - The amount to withdraw.
	 * @returns {Promise<CallResult>} A promise that resolves to the result of the withdrawal transaction.
	 */
	async redeem(signer: ethers.Signer, vault: string, projectId: number, amount: bigint): Promise<CallResult> {
		const userAddress = await signer.getAddress();
		return this.#tryCall(IYelayLiteVault__factory.connect(vault, signer).redeem(amount, projectId, userAddress));
	}

	/**
	 * Migrates a position from one project to another within the same vault.
	 * @param {ethers.Signer} signer - The signer object for the user.
	 * @param {string} vault - The address of the vault.
	 * @param {number} fromProjectId - The ID of the project to migrate from.
	 * @param {number} toProjectId - The ID of the project to migrate to.
	 * @param {bigint} amount - The amount to migrate.
	 * @returns {Promise<CallResult>} A promise that resolves to the result of the migration transaction.
	 */
	async migrate(
		signer: ethers.Signer,
		vault: string,
		fromProjectId: number,
		toProjectId: number,
		amount: bigint,
	): Promise<CallResult> {
		return this.#tryCall(
			IYelayLiteVault__factory.connect(vault, signer).migratePosition(fromProjectId, toProjectId, amount),
		);
	}

	/**
	 * Activates a specific project within the vault.
	 * @param {ethers.Signer} client - The signer object for the user or client.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The ID of the project to activate.
	 * @returns {Promise<CallResult>} A promise that resolves to the result of the activation transaction.
	 */
	async activateProject(client: ethers.Signer, vault: string, projectId: number): Promise<CallResult> {
		return this.#tryCall(IYelayLiteVault__factory.connect(vault, client).activateProject(projectId));
	}

	/**
	 * Checks if a given project ID is active in the specified vault.
	 *
	 * @param vault - The address of the vault contract.
	 * @param projectId - The project ID to check.
	 * @returns A promise that resolves to a boolean indicating whether the project ID is active.
	 */
	async projectIdActive(vault: string, projectId: number): Promise<boolean> {
		return IYelayLiteVault__factory.connect(vault, this.provider).projectIdActive(projectId);
	}

	/**
	 * Retrieves data about a specific client in the specified vault.
	 *
	 * @param client - The address of the client.
	 * @param vault - The address of the vault contract.
	 * @returns A promise that resolves to a `ClientData` object containing:
	 *   - `minProjectId`: The minimum project ID associated with the client (as a number).
	 *   - `maxProjectId`: The maximum project ID associated with the client (as a number).
	 *   - `clientName`: The name of the client decoded from a bytes32 string.
	 */
	async clientData(client: string, vault: string): Promise<ClientData> {
		const result = await IYelayLiteVault__factory.connect(vault, this.provider).ownerToClientData(client);
		return {
			minProjectId: Number(result.minProjectId),
			maxProjectId: Number(result.maxProjectId),
			clientName: ethers.utils.parseBytes32String(result.clientName),
		};
	}

	/**
	 * Retrieves the balance of a user for a specific project within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The ID of the project.
	 * @param {string} user - The address of the user.
	 * @returns {Promise<bigint>} A promise that resolves to the balance of the user in the specified project.
	 */
	async balanceOf(vault: string, projectId: number, user: string): Promise<ethers.BigNumber> {
		return IYelayLiteVault__factory.connect(vault, this.provider).balanceOf(user, projectId);
	}

	#appendTimeFrameQuery(q: URLSearchParams, timeframe?: TimeFrame) {
		if (timeframe?.fromBlock) {
			q.append('fromBlock', timeframe.fromBlock.toString());
		}
		if (timeframe?.toBlock) {
			q.append('toBlock', timeframe.toBlock.toString());
		}
		if (timeframe?.fromTimestamp) {
			q.append('fromTimestamp', timeframe.fromTimestamp.toString());
		}
		if (timeframe?.toTimestamp) {
			q.append('toTimestamp', timeframe.toTimestamp.toString());
		}
	}

	async #tryCall(call: Promise<ethers.ContractTransaction>): Promise<CallResult> {
		const result = { success: false, hash: '' };
		try {
			const tx = await call;
			const receipt = await tx.wait(1);
			if (receipt?.status === 1) {
				result.success = true;
			} else {
			}
			result.hash = tx.hash;
		} catch (error: any) {
			const parsedError = LibErrors__factory.createInterface().parseError(error.data);
			if (parsedError) {
				console.error(`Error: ${parsedError.name}`);
			} else {
				console.error(`Error: ${error}`);
			}
		}
		return result;
	}
}
