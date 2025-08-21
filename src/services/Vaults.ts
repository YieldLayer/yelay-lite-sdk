import { ClientData } from '../types/smartContract.js';
import { Vault } from '../types/vaults.js';

import { VaultsBackend } from '../backend/VaultsBackend.js';
import { HexString } from '@delvtech/drift';
import { SmartContractAdapter } from '../smartContract/index.js';
import { ContractFactory } from '../smartContract/ContractFactory.js';

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

	// /**
	//  * Deposits a specified amount of ETH into a pool in the vault.
	//  * @param {string} vault - The address of the vault.
	//  * @param {number} pool - The pool ID.
	//  * @param {ethers.BigNumberish} amount - The amount of ETH to deposit (in wei).
	//  * @param {Overrides} overrides - Ethers overrides.
	//  * @returns {Promise<CallResult>} A promise that resolves to the result of the deposit transaction.
	//  *
	//  * This method wraps the specified ETH amount and deposits it into the target vault for the given pool.
	//  * It uses the VaultWrapper contract to handle ETH wrapping and depositing in a single transaction.
	//  */
	// public async depositEth(vault: string, pool: number, amount: ethers.BigNumberish): Promise<ContractTransaction> {
	// 	return this.smartContractAdapter.vaultWrapper.depositEth(vault, pool, amount);
	// }

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {string} vault - The address of the vault contract.
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async allowance(userAddress: string, vault: string): Promise<bigint> {
		return this.smartContractAdapter.yelayLiteVault.allowance(userAddress, vault);
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
	 * @param {ethers.BigNumberish} amount - The amount to approve.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the approval transaction.
	 */
	async approve(vault: string, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.approve(vault, amount);
	}

	// /**
	//  * Approves the vault to spend a specified amount of tokens on behalf of the user.
	//  * @param {string} tokenAddress - The address of the token.
	//  * @param {ethers.BigNumberish} amount - The amount to approve.
	//  * @param {Overrides} overrides - Ethers overrides.
	//  * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the approval transaction.
	//  */
	// async approveVaultWrapper(
	// 	tokenAddress: string,
	// 	amount: ethers.BigNumberish,
	// 	overrides?: Overrides,
	// ): Promise<ContractTransaction> {
	// 	return tryCall(this.smartContractAdapter.vaultWrapper.approveVaultWrapper(tokenAddress, amount, overrides));
	// }

	// /**
	//  * Retrieves the allowance of the vault to spend the user's underlying asset.
	//  * @param {string} tokenAddress - Token address
	//  * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	//  */
	// public async vaultWrapperAllowance(tokenAddress: string): Promise<BigNumber> {
	// 	if (!Signer.isSigner(this.signerOrProvider)) {
	// 		throw new Error('Signer is not instantiated in SDK');
	// 	}
	// 	return this.smartContractAdapter.vaultWrapper.vaultWrapperAllowance(this.signerOrProvider, tokenAddress);
	// }

	/**
	 * Deposits a specified amount into a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {ethers.BigNumberish} amount - The amount to deposit.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the deposit transaction.
	 */
	async deposit(vault: string, pool: number, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.deposit(vault, pool, amount);
	}

	// /**
	//  * Deposits a specified amount into a pool in the vault.
	//  * @param {string} vault - The address of the vault.
	//  * @param {number} pool - The pool ID.
	//  * @param {ethers.BigNumberish} amount - The amount to deposit.
	//  * @param {SwapArgsStruct} swapData - Swap args from 1inch.
	//  * @param {CallOverrides} callOverrides - Ethers overrides.
	//  * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the deposit transaction.
	//  */
	// async swapAndDeposit(
	// 	vault: string,
	// 	pool: number,
	// 	amount: ethers.BigNumberish,
	// 	swapData: SwapArgsStruct,
	// 	callOverrides?: CallOverrides,
	// ): Promise<ContractTransaction> {
	// 	return tryCall(
	// 		this.smartContractAdapter.vaultWrapper.swapAndDeposit(vault, pool, swapData, amount, callOverrides),
	// 	);
	// }

	/**
	 * Withdraws a specified amount from a pool in the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The pool ID.
	 * @param {ethers.BigNumberish} amount - The amount to withdraw.\
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the withdrawal transaction.
	 */
	async redeem(vault: string, pool: number, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.redeem(vault, pool, amount);
	}

	/**
	 * Activates a specific pool within the vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool to activate.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the activation transaction.
	 */
	async activatePool(vault: string, pool: number): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.activatePool(vault, pool);
	}

	/**
	 * Migrates a position from one pool to another within the same vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} fromPool - The ID of the pool to migrate from.
	 * @param {number} toPool - The ID of the pool to migrate to.
	 * @param {ethers.BigNumberish} amount - The amount to migrate.
	 * @param {Overrides} overrides - Ethers overrides.
	 * @returns {Promise<ContractTransaction>} A promise that resolves to the result of the migration transaction.
	 */
	async migrate(vault: string, fromPool: number, toPool: number, amount: bigint): Promise<HexString> {
		return this.smartContractAdapter.yelayLiteVault.migrate(vault, fromPool, toPool, amount);
	}
}
