import { HistoricalTVL, HistoricalTVLParams } from '../../../types/pools';

export interface IPoolsBackend {
	/**
	 * Retrieves historical TVL (Total Value Locked) data for a specific vault address and optional pool IDs.
	 * 
	 * @param params - Object containing parameters for the historical TVL query
	 * @returns A promise that resolves to an array of historical TVL data objects.
	 */
	historicalTVL(params: HistoricalTVLParams): Promise<HistoricalTVL[]>;
}
