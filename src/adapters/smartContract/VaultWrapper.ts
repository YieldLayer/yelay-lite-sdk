import { BigNumber, ContractTransaction, Overrides, PayableOverrides, Signer } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';
import { SwapArgsStruct } from '../../generated/typechain/VaultWrapper';
import { getIncreasedGasLimit } from '../../utils/smartContract';

export class VaultWrapper implements IVaultWrapper {
	constructor(private contractFactory: IContractFactory) {}

	public async depositEth(
		vault: string,
		pool: number,
		amount: bigint,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		const estimatedGas = await vaultWrapper.estimateGas.wrapEthAndDeposit(vault, pool, { value: amount });

		return await vaultWrapper.wrapEthAndDeposit(vault, pool, {
			...overrides,
			value: amount,
			gasLimit: getIncreasedGasLimit(estimatedGas),
		});
	}

	public async vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<BigNumber> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();
		const userAddress = await signer.getAddress();

		return await this.contractFactory.getErc20(tokenAddress).allowance(userAddress, vaultWrapper.address);
	}

	public async approveVaultWrapper(
		tokenAddress: string,
		amount: bigint,
		overrides?: Overrides,
	): Promise<ContractTransaction> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();
		const estimatedGas = await this.contractFactory
			.getErc20(tokenAddress)
			.estimateGas.approve(vaultWrapper.address, amount);

		return this.contractFactory
			.getErc20(tokenAddress)
			.approve(vaultWrapper.address, amount, { gasLimit: getIncreasedGasLimit(estimatedGas), ...overrides });
	}

	public async swapAndDeposit(
		vault: string,
		pool: number,
		swapData: SwapArgsStruct,
		amount: bigint,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		const estimatedGas = await vaultWrapper.estimateGas.swapAndDeposit(vault, pool, swapData, amount);

		return await vaultWrapper.swapAndDeposit(vault, pool, swapData, amount, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
			...overrides,
		});
	}
}
