import { ContractTransaction } from 'ethers';
import { SmartContractAdapter } from '../../adapters/smartContract';
import { tryCall } from '../../utils/smartContract';
import { IContractFactory } from '../ports/IContractFactory';

export class DepositLockPlugin {
	private smartContractAdapter: SmartContractAdapter;

	constructor(contractFactory: IContractFactory) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
	}

	/**
	 * Approves the deposit lock.
	 */
	async approve(vault: string, amount: bigint): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.depositLockPlugin.approve(vault, amount));
	}

	/**
	 * Deposits locked assets.
	 */
	async depositLocked(vault: string, pool: number, assets: bigint): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.depositLockPlugin.depositLocked(vault, pool, assets));
	}

	/**
	 * Redeems locked shares.
	 */
	async redeemLocked(vault: string, pool: number, shares: bigint): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.depositLockPlugin.redeemLocked(vault, pool, shares));
	}

	/**
	 * Migrates locked shares between projects.
	 */
	async migrateLocked(vault: string, fromPool: number, toPool: number, shares: bigint): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.depositLockPlugin.migrateLocked(vault, fromPool, toPool, shares));
	}

	/**
	 * Updates the lock period for a project (Vault-Project Owner only).
	 */
	async updateLockPeriod(vault: string, pool: number, newLockPeriod: bigint): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.depositLockPlugin.updateLockPeriod(vault, pool, newLockPeriod));
	}

	/**
	 * Updates the global unlock time for a project (Vault-Project Owner only).
	 */
	async updateGlobalUnlockTime(vault: string, pool: number, newUnlockTime: bigint): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.depositLockPlugin.updateGlobalUnlockTime(vault, pool, newUnlockTime));
	}

	/**
	 * Retrieves matured shares for a user.
	 */
	async getMaturedShares(vault: string, pool: number, user: string) {
		return this.smartContractAdapter.depositLockPlugin.getMaturedShares(vault, pool, user);
	}
}
