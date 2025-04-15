import { BigNumber, ContractTransaction } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IDepositLockPlugin } from '../../app/ports/smartContract/IDepositLockPlugin';
import { getIncreasedGasLimit } from '../../utils/smartContract';

export class DepositLockPlugin implements IDepositLockPlugin {
	constructor(private contractFactory: IContractFactory) {}

	async approve(vault: string, amount: bigint): Promise<ContractTransaction> {
		const depositLock = this.contractFactory.getDepositLockPlugin().address;
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();
		const estimatedGas = await this.contractFactory
			.getErc20(underlyingAsset)
			.estimateGas.approve(depositLock, amount);

		return this.contractFactory
			.getErc20(underlyingAsset)
			.approve(depositLock, amount, { gasLimit: getIncreasedGasLimit(estimatedGas) });
	}

	async depositLocked(vault: string, pool: number, assets: bigint): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.depositLocked(vault, pool, assets);
		return contract.depositLocked(vault, pool, assets, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async redeemLocked(vault: string, pool: number, shares: bigint): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.redeemLocked(vault, pool, shares);
		return contract.redeemLocked(vault, pool, shares, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async migrateLocked(vault: string, fromPool: number, toPool: number, shares: bigint): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.migrateLocked(vault, fromPool, toPool, shares);
		return contract.migrateLocked(vault, fromPool, toPool, shares, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async updateLockPeriod(vault: string, pool: number, newLockPeriod: bigint): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.updateLockPeriod(vault, pool, newLockPeriod);
		return contract.updateLockPeriod(vault, pool, newLockPeriod, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async updateGlobalUnlockTime(vault: string, pool: number, newUnlockTime: bigint): Promise<ContractTransaction> {
		const contract = this.contractFactory.getDepositLockPlugin();
		const estimatedGas = await contract.estimateGas.updateGlobalUnlockTime(vault, pool, newUnlockTime);
		return contract.updateGlobalUnlockTime(vault, pool, newUnlockTime, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	async getMaturedShares(vault: string, pool: number, user: string): Promise<BigNumber> {
		const contract = this.contractFactory.getDepositLockPlugin();
		return contract.getMaturedShares(vault, pool, user);
	}
}
