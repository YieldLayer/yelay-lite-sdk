import { IYieldBackend } from '../../app/ports/backend/IYieldBackend';
import { TimeFrame } from '../../types/backend';
import { PoolYield, VaultYield, YieldAggregated } from '../../types/yield';
import { appendTimeFrameQuery } from '../../utils/backend';

export class YieldBackend implements IYieldBackend {
	private chainId: string;
	private backendUrl: string;

	constructor(backendUrl: string, chainId: number) {
		this.backendUrl = backendUrl;
		this.chainId = chainId.toString();
	}

	async getVaultsYield(vaults?: string[], timeFrame?: TimeFrame): Promise<VaultYield[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('chainId', this.chainId);
		if (vaults) {
			vaults.forEach(vault => searchParams.append('v', vault));
		}
		appendTimeFrameQuery(searchParams, timeFrame);

		const result = (await fetch(`${this.backendUrl}/interest/vaults?${searchParams.toString()}`).then(r =>
			r.json(),
		)) as VaultYield[];

		return result;
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

		const res: { data: PoolYield[] } = await this.axios.get(`/interest/pools?${searchParams.toString()}`);

		return res.data;
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
		const result = (await fetch(`${this.backendUrl}/interest/users?${searchParams.toString()}`).then(r =>
			r.json(),
		)) as YieldAggregated[];
		return result;
	}
}
