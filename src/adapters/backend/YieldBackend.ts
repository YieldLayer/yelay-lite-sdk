import { IYieldBackend } from '../../app/ports/backend/IYieldBackend';
import ApiWrapperService from '../../services/ApiWrapperService';
import { TimeFrame } from '../../types/backend';
import { VaultYield, YieldAggregated } from '../../types/yield';
import { appendTimeFrameQuery } from '../../utils/backend';

export class YieldBackend extends ApiWrapperService implements IYieldBackend {
	constructor(backendUrl: string) {
		super(backendUrl);
	}

	async getVaultsYield(vaults: string[], timeFrame?: TimeFrame): Promise<VaultYield[]> {
		const searchParams = new URLSearchParams();
		vaults.forEach(vault => searchParams.append('address', vault.toString()));
		const appendedSearchParams = appendTimeFrameQuery(searchParams, timeFrame);

		const res: { data: VaultYield[] } = await this.axios.get(`/interest/vaults?${appendedSearchParams.toString()}`);

		return res.data;
	}

	async getYields(
		vaults?: string[],
		pools?: number[],
		users?: string[],
		timeFrame?: TimeFrame,
	): Promise<YieldAggregated[]> {
		const searchParams = new URLSearchParams();
		vaults?.forEach(vault => searchParams.append('v', vault.toLowerCase()));
		pools?.forEach(pool => searchParams.append('p', pool.toString()));
		users?.forEach(user => searchParams.append('u', user.toString()));
		const appendedSearchParams = appendTimeFrameQuery(searchParams, timeFrame);
		const res: { data: YieldAggregated[] } = await this.axios.get(
			`/interest/users?${appendedSearchParams.toString()}`,
		);
		return res.data;
	}
}
