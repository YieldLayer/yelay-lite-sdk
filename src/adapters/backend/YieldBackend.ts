import { IYieldBackend } from '../../app/ports/backend/IYieldBackend';
import { TimeFrame } from '../../types/backend';
import { VaultYield, YieldAggregated } from '../../types/yield';
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
			vaults.forEach(vault => searchParams.append('address', vault));
		}
		appendTimeFrameQuery(searchParams, timeFrame);

		const result = (await fetch(`${this.backendUrl}/interest/vaults?${searchParams.toString()}`).then(r =>
			r.json(),
		)) as VaultYield[];

		return result;
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
