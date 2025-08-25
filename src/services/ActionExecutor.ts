import { HexString, WriteOptions } from '@delvtech/drift';
import { ContractFactory } from '../smartContract/ContractFactory';
import { SmartContractAdapter } from '../smartContract/index';
import { SwapArgsStruct } from '../smartContract/VaultWrapper';
import { ClaimRequest } from '../types/yield';

export class ActionExecutor {
	private smartContractAdapter: SmartContractAdapter;

	constructor(contractFactory: ContractFactory) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
	}

	/**
	 * Deposits a specified amount into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {bigint} amount - The amount to deposit.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async deposit(vault: string, pool: number, amount: bigint, options?: WriteOptions): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.deposit(vault, pool, amount, options);
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
	public async depositEth(vault: string, pool: number, amount: bigint, options?: WriteOptions): Promise<HexString> {
		return this.smartContractAdapter.vaultWrapper.depositEth(vault, pool, amount, options);
	}

	/**
	 * Withdraws a specified amount from a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {bigint} amount - The amount to withdraw.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async withdraw(vault: string, pool: number, amount: bigint, options?: WriteOptions): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.redeem(vault, pool, amount, options);
	}

	/**
	 * Approves the vault to spend a specified amount of tokens on behalf of the user.
	 * @param {string} vault - The address of the vault.
	 * @param {bigint} amount - The amount to approve.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async approve(vault: string, amount: bigint, options?: WriteOptions): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.approve(vault, amount, options);
	}

	/**
	 * Approves the vault wrapper to spend a specified amount of tokens on behalf of the user.
	 * @param {string} tokenAddress - The address of the token.
	 * @param {bigint} amount - The amount to approve.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async approveToken(tokenAddress: string, amount: bigint, options?: WriteOptions): Promise<HexString> {
		return this.smartContractAdapter.vaultWrapper.approveVaultWrapper(tokenAddress, amount, options);
	}

	/**
	 * Deposits a specified amount into a pool in the vault with a swap.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {bigint} amount - The amount to deposit.
	 * @param {SwapArgsStruct} swapData - Swap args from 1inch.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async swapAndDeposit(
		vault: string,
		pool: number,
		amount: bigint,
		swapData: SwapArgsStruct,
		options?: WriteOptions,
	): Promise<HexString> {
		return this.smartContractAdapter.vaultWrapper.swapAndDeposit(vault, pool, swapData, amount, options);
	}

	/**
	 * Migrates a position from one pool to another within the same vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} fromPool - The ID of the pool to migrate from.
	 * @param {number} toPool - The ID of the pool to migrate to.
	 * @param {bigint} amount - The amount to migrate.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async migrate(
		vault: string,
		fromPool: number,
		toPool: number,
		amount: bigint,
		options?: WriteOptions,
	): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.migrate(vault, fromPool, toPool, amount, options);
	}

	/**
	 * Activates a specific pool within the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool to activate.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async activatePool(vault: string, pool: number, options?: WriteOptions): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.activatePool(vault, pool, options);
	}

	/**
	 * Claims yield for the user based on provided claim requests.
	 * @param {ClaimRequest[]} claimRequests - Array of claim requests to process.
	 * @returns {Promise<HexString>} A promise that resolves to the transaction hash.
	 */
	async claim(claimRequests: ClaimRequest[], options?: WriteOptions): Promise<HexString> {
		return this.smartContractAdapter.yieldExtractor.claim(claimRequests, options);
	}
}
