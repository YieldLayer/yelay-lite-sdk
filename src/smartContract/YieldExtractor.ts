import { Address, HexString, WriteOptions } from '@delvtech/drift';
import { ClaimRequest } from '../types/yield';
import { ContractFactory } from './ContractFactory';
import { QUERY_EVENTS_BLOCK_RANGE } from '../utils';

export type YieldClaimed = {
	user: Address;
	vault: Address;
	pool: number;
	cycle: bigint;
	amount: bigint;
	blockNumber?: bigint;
	transactionHash?: HexString;
};

export class YieldExtractor {
	constructor(private contractFactory: ContractFactory) {}

	public async getClaimedShares(user: string, vault: string, pool: number): Promise<bigint> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();
		return yieldExtractor.read('yieldSharesClaimed', [user as Address, vault as Address, BigInt(pool)]);
	}

	public async getLastClaimEvent(
		user: Address,
		vault: Address,
		pool: number,
		stopBlock: number,
	): Promise<YieldClaimed | null> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();
		const latestBlock = await yieldExtractor.client.adapter.getBlockNumber();

		let i = 0;
		while (true) {
			const fromBlock = latestBlock - BigInt(QUERY_EVENTS_BLOCK_RANGE * (i + 1));
			const toBlock = latestBlock - BigInt(QUERY_EVENTS_BLOCK_RANGE * i);
			if (toBlock < stopBlock) {
				return null;
			}
			const events = await yieldExtractor.getEvents('YieldClaimed', {
				fromBlock,
				toBlock,
				filter: {
					user,
					yelayLiteVault: vault,
					projectId: BigInt(pool),
				},
			});

			if (events.length > 0) {
				const event = events[events.length - 1];
				return {
					vault: event.args.yelayLiteVault,
					pool: Number(event.args.projectId),
					amount: event.args.amount,
					cycle: event.args.cycle,
					user: event.args.user,
					transactionHash: event.transactionHash,
					blockNumber: event.blockNumber,
				};
			}
			i++;
		}
	}

	public async claim(claimRequests: ClaimRequest[], options?: WriteOptions): Promise<HexString> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();

		if (yieldExtractor.isReadWrite()) {
			const args = claimRequests.map(c => ({
				yelayLiteVault: c.yelayLiteVault as Address,
				projectId: BigInt(c.pool),
				cycle: BigInt(c.cycle),
				yieldSharesTotal: BigInt(c.yieldSharesTotal),
				proof: c.proof as `0x${string}`[],
			}));

			const txHash = await yieldExtractor.write('claim', { data: args }, options);
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}
}
