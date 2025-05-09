import { BigNumber, ContractTransaction, Overrides, Signer } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IYieldExtractor } from '../../app/ports/smartContract/IYieldExtractor';
import { ClaimRequest } from '../../types';
import { getIncreasedGasLimit } from '../../utils/smartContract';

export class YieldExtractor implements IYieldExtractor {
	constructor(private contractFactory: IContractFactory) {}

	public async getClaimedShares(user: string, vault: string, pool: number): Promise<BigNumber> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();

		return yieldExtractor.yieldSharesClaimed(user, vault, pool);
	}

	public async claim(claimRequests: ClaimRequest[], overrides?: Overrides): Promise<ContractTransaction> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();

		const estimatedGas = await yieldExtractor.estimateGas.claim(claimRequests);

		return yieldExtractor.claim(claimRequests, {
			gasLimit: getIncreasedGasLimit(estimatedGas),
			...overrides,
		});
	}
}
