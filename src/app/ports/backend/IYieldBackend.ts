import { TimeFrame } from '../../../types/backend';
import { ClaimRequest, PoolYield, VaultYield, YieldAggregated } from '../../../types/yield';

export interface IYieldBackend {
	getVaultsYield(vaults?: string[], timeFrame?: TimeFrame): Promise<VaultYield[]>;
	getYields(vaults?: string[], pools?: number[], users?: string[], timeFrame?: TimeFrame): Promise<YieldAggregated[]>;
	getPoolsYield(vaults?: string[], pools?: number[], timeFrame?: TimeFrame): Promise<PoolYield[]>;
	getClaimRequests(user: string, p?: number[]): Promise<ClaimRequest[]>;
}
