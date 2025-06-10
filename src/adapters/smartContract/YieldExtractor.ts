import { BigNumber, ContractTransaction, Overrides } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IYieldExtractor } from '../../app/ports/smartContract/IYieldExtractor';
import { YieldClaimedEvent } from '../../generated/typechain/YieldExtractor';
import { ClaimRequest } from '../../types';
import { populateGasLimit, QUERY_EVENTS_BLOCK_RANGE } from '../../utils/smartContract';

export class YieldExtractor implements IYieldExtractor {
	constructor(private contractFactory: IContractFactory) {}

	public async getClaimedShares(user: string, vault: string, pool: number): Promise<BigNumber> {
		const yieldExtractor = this.contractFactory.getYieldExtractor(true);

		return yieldExtractor.yieldSharesClaimed(user, vault, pool);
	}

	public async getLastClaimEvent(
		user: string,
		vault: string,
		pool: number,
		stopBlock: number,
		latestBlock: number,
	): Promise<YieldClaimedEvent | null> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();

		let i = 0;
		while (true) {
			const fromBlock = latestBlock - QUERY_EVENTS_BLOCK_RANGE * (i + 1);
			const toBlock = latestBlock - QUERY_EVENTS_BLOCK_RANGE * i;
			if (toBlock < stopBlock) {
				return null;
			}
			const events = await yieldExtractor.queryFilter(
				yieldExtractor.filters['YieldClaimed'](user, vault, pool),
				fromBlock,
				toBlock,
			);

			if (events.length > 0) {
				return events[events.length - 1];
			}
			i++;
		}
	}

	public async claim(claimRequests: ClaimRequest[], overrides: Overrides = {}): Promise<ContractTransaction> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();

		const args = claimRequests.map(c => ({
			yelayLiteVault: c.yelayLiteVault,
			projectId: c.pool,
			cycle: c.cycle,
			yieldSharesTotal: c.yieldSharesTotal,
			proof: c.proof,
		}));

		await populateGasLimit(yieldExtractor.estimateGas.claim, [args], overrides);

		return yieldExtractor.claim(args, overrides);
	}
}
