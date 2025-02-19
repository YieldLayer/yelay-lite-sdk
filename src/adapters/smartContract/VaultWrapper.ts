import { ContractTransaction, PayableOverrides } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';

export class VaultWrapper implements IVaultWrapper {
	constructor(private contractFactory: IContractFactory) {}

	public async depositEth(
		vault: string,
		projectId: number,
		amount: bigint,
		overrides?: PayableOverrides,
	): Promise<ContractTransaction> {
		const vaultWrapper = this.contractFactory.getVaultWrapper();

		return await vaultWrapper.wrapEthAndDeposit(vault, projectId, { ...overrides, value: amount });
	}
}
