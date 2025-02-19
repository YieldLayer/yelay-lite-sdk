import { BigNumber, ContractTransaction, Signer } from 'ethers';
import { tryCall } from '../../utils/smartContract';
import { SmartContractAdapter } from '../../adapters/smartContract';
import { IContractFactory } from '../ports/IContractFactory';
import { VaultsBackend } from '../../adapters/backend/VaultsBackend';
import { Vault } from '../../types/vaults';
import { Provider } from '@ethersproject/abstract-provider';
import { ClientData } from '../../types/smartContract';

export class Vaults {
	private smartContractAdapter: SmartContractAdapter;
	private vaultsBackend: VaultsBackend;
	private signerOrProvider: Signer | Provider;

	constructor(contractFactory: IContractFactory, backendUrl: string, signerOrProvider: Signer | Provider) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.vaultsBackend = new VaultsBackend(backendUrl);
		this.signerOrProvider = signerOrProvider;
	}

	/**
	 * Retrieves a list of all vaults.
	 * @returns {Promise<Vault[]>} A promise that resolves to an array of vault objects.
	 */
	public async getVaults(chainId: number | string): Promise<Vault[]> {
		return this.vaultsBackend.getVaults(chainId);
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
	public async depositEth(vault: string, projectId: number, amount: bigint): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.vaultWrapper.depositEth(vault, projectId, amount));
	}

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {ethers.Signer} signer - The signer object for the user.
	 * @param {string} vault - The address of the vault contract.
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async allowance(vault: string): Promise<BigNumber> {
		if (!Signer.isSigner(this.signerOrProvider)) {
			throw new Error('Signer is not instantiated in SDK');
		}
		return this.smartContractAdapter.yelayLiteVault.allowance(this.signerOrProvider, vault);
	}

	/**
	 * Checks if a given project ID is active in the specified vault.
	 *
	 * @param vault - The address of the vault contract.
	 * @param projectId - The project ID to check.
	 * @returns A promise that resolves to a boolean indicating whether the project ID is active.
	 */
	async projectIdActive(vault: string, projectId: number): Promise<boolean> {
		return this.smartContractAdapter.yelayLiteVault.projectIdActive(vault, projectId);
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
		return this.smartContractAdapter.yelayLiteVault.clientData(client, vault);
	}

	/**
	 * Retrieves the balance of a user for a specific project within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The ID of the project.
	 * @param {string} user - The address of the user.
	 * @returns {Promise<bigint>} A promise that resolves to the balance of the user in the specified project.
	 */
	async balanceOf(vault: string, projectId: number, user: string): Promise<BigNumber> {
		return this.smartContractAdapter.yelayLiteVault.balanceOf(vault, projectId, user);
	}

	/**
	 * Approves the vault to spend a specified amount of tokens on behalf of the user.
	 * @param {string} vault - The address of the vault.
	 * @param {bigint} amount - The amount to approve.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the approval transaction.
	 */
	async approve(vault: string, amount: bigint): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.yelayLiteVault.approve(vault, amount));
	}

	/**
	 * Deposits a specified amount into a project in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The project ID.
	 * @param {bigint} amount - The amount to deposit.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the deposit transaction.
	 */
	async deposit(vault: string, projectId: number, amount: bigint): Promise<ContractTransaction> {
		if (!Signer.isSigner(this.signerOrProvider)) {
			throw new Error('Signer is not instantiated in SDK');
		}

		return tryCall(
			this.smartContractAdapter.yelayLiteVault.deposit(this.signerOrProvider, vault, projectId, amount),
		);
	}

	/**
	 * Withdraws a specified amount from a project in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The project ID.
	 * @param {bigint} amount - The amount to withdraw.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the withdrawal transaction.
	 */
	async redeem(vault: string, projectId: number, amount: bigint): Promise<ContractTransaction> {
		if (!Signer.isSigner(this.signerOrProvider)) {
			throw new Error('Signer is not instantiated in SDK');
		}
		return tryCall(
			this.smartContractAdapter.yelayLiteVault.redeem(this.signerOrProvider, vault, projectId, amount),
		);
	}

	/**
	 * Activates a specific project within the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The ID of the project to activate.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the activation transaction.
	 */
	async activateProject(vault: string, projectId: number): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.yelayLiteVault.activateProject(vault, projectId));
	}

	/**
	 * Migrates a position from one project to another within the same vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} fromProjectId - The ID of the project to migrate from.
	 * @param {number} toProjectId - The ID of the project to migrate to.
	 * @param {bigint} amount - The amount to migrate.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the migration transaction.
	 */
	async migrate(
		vault: string,
		fromProjectId: number,
		toProjectId: number,
		amount: bigint,
	): Promise<ContractTransaction> {
		return this.smartContractAdapter.yelayLiteVault.migrate(vault, fromProjectId, toProjectId, amount);
	}
}
