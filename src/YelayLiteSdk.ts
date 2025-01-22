import { ethers } from 'ethers';
import { ERC20__factory } from './../typechain/generated/factories/ERC20__factory';
import { IYelayLiteVault__factory } from './../typechain/generated/factories/IYelayLiteVault__factory';
import { LibErrors__factory } from './../typechain/generated/factories/LibErrors__factory';
import { CallResult, ProjectYield, TimeFrame, UserYield, Vault, VaultYield, YelayLiteSdkConfig } from './types';

export class YelayLiteSdk {
	private backendUrl: string;
	private provider: ethers.JsonRpcProvider;

	constructor(private readonly config: YelayLiteSdkConfig) {
		this.backendUrl = config.backendUrl;
		this.provider = new ethers.JsonRpcProvider(config.rpcUrl, undefined, { staticNetwork: true });
	}

	/**
	 * Retrieves a list of all vaults.
	 * @returns {Promise<Vault[]>} A promise that resolves to an array of vault objects.
	 */
	async getVaults(): Promise<Vault[]> {
		const res = await fetch(`${this.backendUrl}/vaults`);
		const vaults = await res.json();
		return vaults;
	}

	/**
	 * Retrieves the yield of a specific vault.
	 * @param {string} vault - The address of the vault.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<VaultYield>} A promise that resolves to the yield data for the vault.
	 */
	async getVaultYield(vault: string, timeFrame?: TimeFrame): Promise<VaultYield> {
		const q = new URLSearchParams({ address: vault });
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
	 * Retrieves the balance of a user for a specific project within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The ID of the project.
	 * @param {string} user - The address of the user.
	 * @returns {Promise<bigint>} A promise that resolves to the balance of the user in the specified project.
	 */
	async balanceOf(vault: string, projectId: number, user: string): Promise<bigint> {
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

	async #tryCall(call: Promise<ethers.ContractTransactionResponse>): Promise<CallResult> {
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
