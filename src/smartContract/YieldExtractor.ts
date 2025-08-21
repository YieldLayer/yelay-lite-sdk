import { Address, HexString } from '@delvtech/drift';
import { ClaimRequest } from '../types/yield.js';
import { ContractFactory } from './ContractFactory.js';

export type YieldClaimedEvent = {
	user: string;
	yelayLiteVault: string;
	projectId: bigint;
	cycle: bigint;
	amount: bigint;
	blockNumber: number;
	transactionHash: string;
};

export class YieldExtractor {
	constructor(private contractFactory: ContractFactory) {}

	public async getClaimedShares(user: string, vault: string, pool: number): Promise<bigint> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();
		return yieldExtractor.read('yieldSharesClaimed', [user as Address, vault as Address, BigInt(pool)]);
	}

	public async getLastClaimEvent(
		user: string,
		vault: string,
		pool: number,
		stopBlock: number,
		latestBlock: number,
	): Promise<YieldClaimedEvent | null> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();

		// TODO: Implement event querying with viem
		// This would need to be implemented using viem's getLogs or similar
		// For now, returning null as placeholder
		return null;
	}

	public async claim(claimRequests: ClaimRequest[]): Promise<HexString> {
		const yieldExtractor = this.contractFactory.getYieldExtractor();

		if (yieldExtractor.isReadWrite()) {
			const args = claimRequests.map(c => ({
				yelayLiteVault: c.yelayLiteVault as Address,
				projectId: BigInt(c.pool),
				cycle: BigInt(c.cycle),
				yieldSharesTotal: BigInt(c.yieldSharesTotal),
				proof: c.proof as `0x${string}`[],
			}));

			const txHash = await yieldExtractor.write('claim', { data: args });
			return txHash;
		} else {
			throw new Error('Not read');
		}
	}
}
