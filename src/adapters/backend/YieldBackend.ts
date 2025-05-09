import { IYieldBackend } from '../../app/ports/backend/IYieldBackend';
import ApiWrapperService from '../../services/ApiWrapperService';
import { TimeFrame } from '../../types/backend';
import { ClaimRequest, PoolYield, VaultYield, YieldAggregated } from '../../types/yield';
import { appendTimeFrameQuery } from '../../utils/backend';

export class YieldBackend extends ApiWrapperService implements IYieldBackend {
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

	async getClaimRequests(user: string): Promise<ClaimRequest[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('chainId', this.chainId);
		searchParams.append('u', user.toString());
		return this.get<ClaimRequest[]>(`/claim-proof?${searchParams.toString()}`);
	}
}
