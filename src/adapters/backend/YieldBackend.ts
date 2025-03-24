import { IYieldBackend } from '../../app/ports/backend/IYieldBackend';
import ApiWrapperService from '../../services/ApiWrapperService';
import { TimeFrame } from '../../types/backend';
import { VaultYield, YieldAggregated } from '../../types/yield';
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
			vaults.forEach(vault => searchParams.append('address', vault));
		}
		appendTimeFrameQuery(searchParams, timeFrame);

		const res: { data: VaultYield[] } = await this.axios.get(`/interest/vaults?${searchParams.toString()}`);

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
		const res: { data: YieldAggregated[] } = await this.axios.get(`/interest/users?${searchParams.toString()}`);
		return res.data;
	}
}
