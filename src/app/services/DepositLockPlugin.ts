import { Signer, ContractTransaction } from 'ethers';
import { IContractFactory } from '../ports/IContractFactory';
import { SmartContractAdapter } from '../../adapters/smartContract';
import { tryCall } from '../../utils/smartContract';

export class DepositLockPluginService {
	private smartContractAdapter: SmartContractAdapter;

	constructor(contractFactory: IContractFactory) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
	}

	/**
	 * Deposits locked assets.
	 */
	async depositLocked(
		signer: Signer,
		vault: string,
		projectId: number,
		assets: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.depositLocked(signer, vault, projectId, assets)
		);
	}

	/**
	 * Redeems locked shares.
	 */
	async redeemLocked(
		signer: Signer,
		vault: string,
		projectId: number,
		shares: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.redeemLocked(signer, vault, projectId, shares)
		);
	}

	/**
	 * Migrates locked shares between projects.
	 */
	async migrateLocked(
		signer: Signer,
		vault: string,
		fromProjectId: number,
		toProjectId: number,
		shares: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.migrateLocked(
				signer,
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
		signer: Signer,
		vault: string,
		projectId: number,
		newLockPeriod: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.updateLockPeriod(
				signer,
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
		signer: Signer,
		vault: string,
		projectId: number,
		newUnlockTime: bigint
	): Promise<ContractTransaction> {
		return tryCall(
			this.smartContractAdapter.depositLockPlugin.updateGlobalUnlockTime(signer, vault, projectId, newUnlockTime)
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
