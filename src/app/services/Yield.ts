import { YieldBackend } from '../../adapters/backend/YieldBackend';
import { TimeFrame } from '../../types/backend';
import { PoolYield, VaultYield, YieldAggregated } from '../../types/yield';
import { getTimestampOneWeekAgo } from '../../utils/backend';

export class Yield {
	private yieldBackend: YieldBackend;

	constructor(backendUrl: string, chainId: number) {
		this.yieldBackend = new YieldBackend(backendUrl, chainId);
	}

	/**
	 * Retrieves the yield of the vaults. If TimeFrame is not provided, then it will by default set the fromTimestamp to 1 week ago.
	 * @param {string[]} vaults - Optional array of vault addresses to filter results.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<VaultYield[]>} A promise that resolves to the yield data for the vaults.
	 */
	public async getVaultsYield(vaults?: string[], timeFrame?: TimeFrame): Promise<VaultYield[]> {
		return await this.yieldBackend.getVaultsYield(
			vaults,
			timeFrame ? timeFrame : { fromTimestamp: getTimestampOneWeekAgo() },
		);
	}

	/**
	 * Retrieves the yield of the pools within a given timeframe.
	 * @param {string[]} vaults - Optional array of vault addresses to filter results.
	 * @param {number[]} [pools] - Optional array of pool IDs to filter results.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<PoolYield[]>} A promise that resolves to the yield data for the pools.
	 */
	public async getPoolsYield(vaults?: string[], pools?: number[], timeFrame?: TimeFrame): Promise<PoolYield[]> {
		return await this.yieldBackend.getPoolsYield(vaults, pools, timeFrame);
	}

	/**
	 * Retrieves the aggregated yield data for specified vaults, pools, and users within a given timeframe.
	 * @param {string[]} [vaults] - Optional array of vault addresses to filter results.
	 * @param {number[]} [pools] - Optional array of pool IDs to filter results.
	 * @param {string[]} [users] - Optional array of user addresses to filter results.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe to limit results within a specific period.
	 * @returns {Promise<YieldAggregated[]>} A promise that resolves to an array of aggregated yield data.
	 */
	async getYields(
		vaults?: string[],
		pools?: number[],
		users?: string[],
		timeFrame?: TimeFrame,
	): Promise<YieldAggregated[]> {
		return await this.yieldBackend.getYields(vaults, pools, users, timeFrame);
	}
}
