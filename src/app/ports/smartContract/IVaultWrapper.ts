import { ContractTransaction, PayableOverrides } from 'ethers';

export interface IVaultWrapper {
	depositEth(
		vault: string,
		projectId: number,
		amount: bigint,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction>;
}
