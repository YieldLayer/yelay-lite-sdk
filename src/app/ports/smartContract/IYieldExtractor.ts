import { BigNumber, ContractTransaction, Overrides } from 'ethers';
import { YieldClaimedEvent } from '../../../generated/typechain/YieldExtractor';
import { ClaimRequest } from '../../../types';

export interface IYieldExtractor {
	getClaimedShares(user: string, vault: string, pool: number): Promise<BigNumber>;
	claim(claimRequests: ClaimRequest[], overrides?: Overrides): Promise<ContractTransaction>;
	getLastClaimEvent(
		user: string,
		vault: string,
		pool: number,
		blockRange: number,
		latestBlock: number,
		maxDepth?: number,
	): Promise<YieldClaimedEvent | undefined>;
}
