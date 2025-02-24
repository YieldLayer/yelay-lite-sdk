import { ContractTransaction, BigNumber } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IDepositLockPlugin } from '../../app/ports/smartContract/IDepositLockPlugin';
import { getIncreasedGasLimit } from '../../utils/smartContract';

export class DepositLockPlugin implements IDepositLockPlugin {
	constructor(private contractFactory: IContractFactory) {}

	async approve(vault: string, amount: bigint): Promise<ContractTransaction> {
		const depositLock = this.contractFactory.getDepositLockPlugin().address;
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();
		const estimatedGas = await this.contractFactory.getErc20(underlyingAsset).estimateGas.approve(depositLock, amount);

		return this.contractFactory
			.getErc20(underlyingAsset)
			.approve(depositLock, amount, { gasLimit: getIncreasedGasLimit(estimatedGas) });
	}

	async depositLocked(
		vault: string,
		projectId: number,
		assets: bigint
	): Promise<ContractTransaction> {

		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.depositLocked(vault, projectId, assets);
		return contract.depositLocked(vault, projectId, assets, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async redeemLocked(
		vault: string,
		projectId: number,
		shares: bigint
	): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.redeemLocked(vault, projectId, shares);
		return contract.redeemLocked(vault, projectId, shares, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async migrateLocked(
		vault: string,
		fromProjectId: number,
		toProjectId: number,
		shares: bigint
	): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.migrateLocked(
			vault,
			fromProjectId,
			toProjectId,
			shares,
		);
		return contract.migrateLocked(vault, fromProjectId, toProjectId, shares, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async updateLockPeriod(
		vault: string,
		projectId: number,
		newLockPeriod: bigint
	): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.updateLockPeriod(vault, projectId, newLockPeriod);
		return contract.updateLockPeriod(vault, projectId, newLockPeriod, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async updateGlobalUnlockTime(
		vault: string,
        projectId: number,
		newUnlockTime: bigint
	): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.updateGlobalUnlockTime(vault, projectId, newUnlockTime);
		return contract.updateGlobalUnlockTime(vault, projectId, newUnlockTime, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async getMaturedShares(
		vault: string,
		projectId: number,
		user: string
	): Promise<BigNumber> {
		const contract = this.contractFactory.getDepositLockPlugin();
		return contract.getMaturedShares(vault, projectId, user);
	}
} 
