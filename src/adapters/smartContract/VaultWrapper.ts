import { BigNumber, ContractTransaction, PayableOverrides, Signer } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';
import { SwapArgsStruct } from '../../generated/typechain/VaultWrapper';
import { getIncreasedGasLimit } from '../../utils/smartContract';

export class VaultWrapper implements IVaultWrapper {
	constructor(private contractFactory: IContractFactory) {}

	public async depositEth(
		vault: string,
		projectId: number,
		amount: bigint,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		const estimatedGas = await vaultWrapper.estimateGas.wrapEthAndDeposit(vault, projectId, { value: amount });

		return await vaultWrapper.wrapEthAndDeposit(vault, projectId, {
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

	public async approveVaultWrapper(tokenAddress: string, amount: bigint): Promise<ContractTransaction> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();
		const estimatedGas = await this.contractFactory
			.getErc20(tokenAddress)
			.estimateGas.approve(vaultWrapper.address, amount);

		return this.contractFactory
			.getErc20(tokenAddress)
			.approve(vaultWrapper.address, amount, { gasLimit: getIncreasedGasLimit(estimatedGas) });
	}

	public async swapAndDeposit(
		vault: string,
		projectId: number,
		swapData: SwapArgsStruct,
		amount: bigint,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		return await vaultWrapper.swapAndDeposit(vault, projectId, swapData, amount, {
			gasLimit: 1000000,
			...overrides,
		});
	}
}
