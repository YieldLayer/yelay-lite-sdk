import { ClientData } from '../types/smartContract';
import { Vault } from '../types/vaults';

import { VaultsBackend } from '../backend/VaultsBackend';
import { HexString } from '@delvtech/drift';
import { SmartContractAdapter } from '../smartContract/index';
import { ContractFactory } from '../smartContract/ContractFactory';
import { SwapArgsStruct } from '../smartContract/VaultWrapper';

export class Vaults {
	private smartContractAdapter: SmartContractAdapter;
	private vaultsBackend: VaultsBackend;

	constructor(contractFactory: ContractFactory, backendUrl: string, chainId: number) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.vaultsBackend = new VaultsBackend(backendUrl, chainId);
	}

	/**
	 * Retrieves a list of all vaults.
	 * @returns {Promise<Vault[]>} A promise that resolves to an array of vault objects.
	 */
	public async getVaults(): Promise<Vault[]> {
		return this.vaultsBackend.getVaults();
	}

	/**
	 * Deposits a specified amount of ETH into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {bigint} amount - The amount of ETH to deposit (in wei).
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 *
	 * This method wraps the specified ETH amount and deposits it into the target vault for the given pool.
	 * It uses the VaultWrapper contract to handle ETH wrapping and depositing in a single transaction.
	 */
	public async depositEth(vault: string, pool: number, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.vaultWrapper.depositEth(vault, pool, amount);
	}

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {string} vault - The address of the vault contract.
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async allowance(vault: string): Promise<bigint> {
		return this.smartContractAdapter.yelayLiteVault.allowance(vault);
	}

	/**
	 * Checks if a given pool ID is active in the specified vault.
	 *
	 * @param vault - The address of the vault contract.
	 * @param pool - The pool ID to check.
	 * @returns A promise that resolves to a boolean indicating whether the pool ID is active.
	 */
	async poolActive(vault: string, pool: number): Promise<boolean> {
		return this.smartContractAdapter.yelayLiteVault.poolActive(vault, pool);
	}

	/**
	 * Retrieves data about a specific client in the specified vault.
	 *
	 * @param {string} client - The address of the client.
	 * @param {string} vault - The address of the vault contract.
	 * @returns A promise that resolves to a `ClientData` object containing:
	 *   - `minPool`: The minimum pool ID associated with the client (as a number).
	 *   - `maxPool`: The maximum pool ID associated with the client (as a number).
	 *   - `clientName`: The name of the client decoded from a bytes32 string.
	 */
	async clientData(client: string, vault: string): Promise<ClientData> {
		return this.smartContractAdapter.yelayLiteVault.clientData(client, vault);
	}

	/**
	 * Retrieves the balance of a user for a specific pool within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool.
	 * @param {string} user - The address of the user.
	 * @returns {Promise<bigint>} A promise that resolves to the balance of the user in the specified pool.
	 */
	async balanceOf(vault: string, pool: number, user: string): Promise<bigint> {
		return this.smartContractAdapter.yelayLiteVault.balanceOf(vault, pool, user);
	}

	/**
	 * Approves the vault to spend a specified amount of tokens on behalf of the user.
	 * @param {string} vault - The address of the vault.
	 * @param {bigint} amount - The amount to approve.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async approve(vault: string, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.approve(vault, amount);
	}

	/**
	 * Approves the vault wrapper to spend a specified amount of tokens on behalf of the user.
	 * @param {string} tokenAddress - The address of the token.
	 * @param {bigint} amount - The amount to approve.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async approveVaultWrapper(tokenAddress: string, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.vaultWrapper.approveVaultWrapper(tokenAddress, amount);
	}

	/**
	 * Retrieves the allowance of the vault wrapper to spend the user's tokens.
	 * @param {string} tokenAddress - Token address
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async vaultWrapperAllowance(tokenAddress: string): Promise<bigint> {
		return this.smartContractAdapter.vaultWrapper.vaultWrapperAllowance(tokenAddress);
	}

	/**
	 * Deposits a specified amount into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {bigint} amount - The amount to deposit.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async deposit(vault: string, pool: number, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.deposit(vault, pool, amount);
	}

	/**
	 * Deposits a specified amount into a pool in the vault with a swap.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {bigint} amount - The amount to deposit.
	 * @param {SwapArgsStruct} swapData - Swap args from 1inch.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async swapAndDeposit(vault: string, pool: number, amount: bigint, swapData: SwapArgsStruct): Promise<HexString> {
		return this.smartContractAdapter.vaultWrapper.swapAndDeposit(vault, pool, swapData, amount);
	}

	/**
	 * Withdraws a specified amount from a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {bigint} amount - The amount to withdraw.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async redeem(vault: string, pool: number, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.redeem(vault, pool, amount);
	}

	/**
	 * Activates a specific pool within the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool to activate.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async activatePool(vault: string, pool: number): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.activatePool(vault, pool);
	}

	/**
	 * Migrates a position from one pool to another within the same vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} fromPool - The ID of the pool to migrate from.
	 * @param {number} toPool - The ID of the pool to migrate to.
	 * @param {bigint} amount - The amount to migrate.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async migrate(vault: string, fromPool: number, toPool: number, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.migrate(vault, fromPool, toPool, amount);
	}
}
