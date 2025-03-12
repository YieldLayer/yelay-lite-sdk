import { BigNumber, ContractTransaction, ethers, Overrides, PayableOverrides, Signer } from 'ethers';
import { SwapArgsStruct } from '../../../generated/typechain/VaultWrapper';

export interface IVaultWrapper {
	depositEth(
		vault: string,
		pool: number,
		amount: ethers.BigNumberish,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction>;
	vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<BigNumber>;
	approveVaultWrapper(
		tokenAddress: string,
		amount: ethers.BigNumberish,
		overrides?: Overrides,
	): Promise<ContractTransaction>;
	swapAndDeposit(
		vault: string,
		pool: number,
		swapData: SwapArgsStruct,
		amount: ethers.BigNumberish,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction>;
}
