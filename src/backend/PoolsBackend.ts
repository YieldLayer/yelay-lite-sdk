import ApiWrapperService from '../services/ApiWrapperService';
import { HistoricalTVL, HistoricalTVLParams, PaginatedResponse } from '../types/index';

export class PoolsBackend extends ApiWrapperService {
	private chainId: number;

	constructor(backendUrl: string, chainId: number) {
		super(backendUrl);
		this.chainId = chainId;
	}

	/**
	 * Retrieves historical TVL (Total Value Locked) data for a specific vault address and optional pool IDs.
	 *
	 * @param params - Object containing parameters for the historical TVL query
	 * @returns A promise that resolves to a paginated response containing historical TVL data objects.
	 */
	async historicalTVL(params: HistoricalTVLParams): Promise<PaginatedResponse<HistoricalTVL>> {
		const searchParams = new URLSearchParams();

		searchParams.append('chainId', this.chainId.toString());
		searchParams.append('vaultAddress', params.vaultAddress.toLowerCase());
		searchParams.append('poolId', params.poolId.toString());

		if (params.fromTimestamp) {
			searchParams.append('fromTimestamp', params.fromTimestamp.toString());
		}
		if (params.toTimestamp) {
			searchParams.append('toTimestamp', params.toTimestamp.toString());
		}

		if (params.page) {
			searchParams.append('page', params.page.toString());
		}
		if (params.pageSize) {
			searchParams.append('pageSize', params.pageSize.toString());
		}

		return this.get<PaginatedResponse<HistoricalTVL>>(`/tvl?${searchParams.toString()}`);
	}
}
