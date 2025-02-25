import { BigNumber, ContractTransaction, Overrides, PayableOverrides, Signer } from 'ethers';
import { SwapArgsStruct } from '../../../generated/typechain/VaultWrapper';

export interface IVaultWrapper {
	depositEth(
		vault: string,
		projectId: number,
		amount: bigint,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction>;
	vaultWrapperAllowance(signer: Signer, tokenAddress: string): Promise<BigNumber>;
	approveVaultWrapper(tokenAddress: string, amount: bigint, overrides?: Overrides): Promise<ContractTransaction>;
	swapAndDeposit(
		vault: string,
		projectId: number,
		swapData: SwapArgsStruct,
		amount: bigint,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction>;
}
