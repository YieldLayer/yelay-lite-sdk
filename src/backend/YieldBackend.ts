import ApiWrapperService from '../services/ApiWrapperService';
import {
	ClaimRequest,
	ClaimRequestParams,
	ClaimRequestRaw,
	PoolYield,
	TimeFrame,
	VaultYield,
	YieldAggregated,
} from '../types/index';
import { appendTimeFrameQuery } from '../utils/backend';

export class YieldBackend extends ApiWrapperService {
	private chainId: string;

	constructor(backendUrl: string, chainId: number) {
		super(backendUrl);
		this.chainId = chainId.toString();
	}

	async getVaultsYield(vaults?: string[], timeFrame?: TimeFrame): Promise<VaultYield[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('chainId', this.chainId);
		if (vaults) {
			vaults.forEach(vault => searchParams.append('v', vault));
		}
		appendTimeFrameQuery(searchParams, timeFrame);

		return this.get<VaultYield[]>(`/interest/vaults?${searchParams.toString()}`);
	}

	async getPoolsYield(vaults?: string[], pools?: number[], timeFrame?: TimeFrame): Promise<PoolYield[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('chainId', this.chainId);
		if (vaults) {
			vaults.forEach(vault => searchParams.append('v', vault));
		}
		if (pools) {
			pools.forEach(pool => searchParams.append('p', pool.toString()));
		}
		appendTimeFrameQuery(searchParams, timeFrame);

		return this.get<PoolYield[]>(`/interest/pools?${searchParams.toString()}`);
	}

	async getYields(
		vaults?: string[],
		pools?: number[],
		users?: string[],
		timeFrame?: TimeFrame,
	): Promise<YieldAggregated[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('chainId', this.chainId);
		vaults?.forEach(vault => searchParams.append('v', vault.toLowerCase()));
		pools?.forEach(pool => searchParams.append('p', pool.toString()));
		users?.forEach(user => searchParams.append('u', user.toString()));
		appendTimeFrameQuery(searchParams, timeFrame);
		return this.get<YieldAggregated[]>(`/interest/users?${searchParams.toString()}`);
	}

	async getClaimRequests(params: ClaimRequestParams): Promise<ClaimRequest[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('chainId', this.chainId);
		searchParams.append('u', params.user.toString());

		if (params.poolIds && params.poolIds.length) {
			for (const poolId of params.poolIds) {
				searchParams.append('p', poolId.toString());
			}
		}

		if (params.vaultAddresses && params.vaultAddresses.length) {
			for (const vaultAddress of params.vaultAddresses) {
				searchParams.append('v', vaultAddress);
			}
		}
		const result = await this.get<ClaimRequestRaw[]>(`/claim-proof?${searchParams.toString()}`);
		return result.map(c => ({
			yelayLiteVault: c.yelayLiteVault,
			pool: c.projectId,
			cycle: c.cycle,
			yieldSharesTotal: c.yieldSharesTotal,
			blockNumber: c.blockNumber,
			proof: c.proof,
		}));
	}
}
