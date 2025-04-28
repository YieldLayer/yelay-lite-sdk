import { SmartContractAdapter } from '../../adapters/smartContract';
import { PoolsBackend } from '../../adapters/backend/PoolsBackend';
import { IContractFactory } from '../ports/IContractFactory';
import { PoolsTvl, HistoricalTVL, HistoricalTVLParams } from '../../types/pools';

export class Pools {
	private smartContractAdapter: SmartContractAdapter;
	private poolsBackend: PoolsBackend;

	constructor(contractFactory: IContractFactory, backendUrl: string, chainId: number) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.poolsBackend = new PoolsBackend(backendUrl, chainId);
	}

	/**
	 * Retrieves the TVL of the pools.
	 * @param {string} vault - The address of the vault.
	 * @param {number[]} pools - Array of pool IDs to query.
	 * @returns {Promise<PoolsTvl[]>} A promise that resolves to an array of TVL values for each pool.
	 */
	async getPoolsTvl(vault: string, pools: number[]): Promise<PoolsTvl[]> {
		const { totalAssets, totalSupply, poolsSupply } =
			await this.smartContractAdapter.yelayLiteVault.getPoolsSupplies(vault, pools);

		return poolsSupply.map((poolSupply, index) => ({
			id: pools[index],
			tvl: totalAssets.mul(poolSupply).div(totalSupply),
		}));
	}

	/**
	 * Fetch historical Total Value Locked (TVL) data for a specific vault and pool.
	 *
	 * @param {HistoricalTVLParams} params - Parameters for querying historical TVL:
	 *   - `vaultAddress` **(required)**: Vault address to retrieve TVL for.
	 *   - `poolId` **(required)**: Pool ID to filter data by.
	 *   - `fromTimestamp` *(optional)*: Start timestamp (in seconds).
	 *   - `toTimestamp` *(optional)*: End timestamp (in seconds).
	 *   - `page` *(optional)*: Page number for pagination (starts at 1).
	 *   - `pageSize` *(optional)*: Number of records per page (max 100).
	 *
	 * @returns {Promise<HistoricalTVL[]>} Resolves with an array of historical TVL entries.
	 */
	public async historicalTVL(params: HistoricalTVLParams): Promise<HistoricalTVL[]> {
		return await this.poolsBackend.historicalTVL(params);
	}
}
