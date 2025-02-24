import { ContractTransaction } from 'ethers';
import { IContractFactory } from '../ports/IContractFactory';
import { SmartContractAdapter } from '../../adapters/smartContract';
import { tryCall } from '../../utils/smartContract';

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
	async depositLocked(
		vault: string,
		projectId: number,
		assets: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.depositLocked(vault, projectId, assets)
		);
	}

	/**
	 * Redeems locked shares.
	 */
	async redeemLocked(
		vault: string,
		projectId: number,
		shares: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.redeemLocked(vault, projectId, shares)
		);
	}

	/**
	 * Migrates locked shares between projects.
	 */
	async migrateLocked(
		vault: string,
		fromProjectId: number,
		toProjectId: number,
		shares: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.migrateLocked(
				vault,
				fromProjectId,
				toProjectId,
				shares,
			)
		);
	}

	/**
	 * Updates the lock period for a project (Vault-Project Owner only).
	 */
	async updateLockPeriod(
		vault: string,
		projectId: number,
		newLockPeriod: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.updateLockPeriod(
				vault,
				projectId,
				newLockPeriod,
			)
		);
	}

	/**
	 * Updates the global unlock time for a project (Vault-Project Owner only).
	 */
	async updateGlobalUnlockTime(
		vault: string,
		projectId: number,
		newUnlockTime: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.updateGlobalUnlockTime(vault, projectId, newUnlockTime)
		);
	}

	/**
	 * Retrieves matured shares for a user.
	 */
	async getMaturedShares(
		vault: string,
		projectId: number,
		user: string
	) {
		return this.smartContractAdapter.depositLockPlugin.getMaturedShares(vault, projectId, user);
	}
} 
