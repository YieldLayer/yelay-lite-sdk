import { PoolsBackend } from '../backend/PoolsBackend';
import { StrategiesBackend } from '../backend/StrategiesBackend';
import { YieldBackend } from '../backend/YieldBackend';
import { VaultsBackend } from '../backend/VaultsBackend';
import { ContractFactory } from '../smartContract/ContractFactory';
import { SmartContractAdapter } from '../smartContract/index';
import { PaginatedResponse, TimeFrame } from '../types/backend';
import { ChainId } from '../types/config';
import { HistoricalTVL, HistoricalTVLParams, PoolsTvl } from '../types/pools';
import { ClientData } from '../types/smartContract';
import { Protocol, Strategy } from '../types/strategies';
import { Vault } from '../types/vaults';
import { PoolYield, VaultYield, YieldAggregated } from '../types/yield';
import { getTimestampOneWeekAgo } from '../utils';

export class DataProvider {
	private smartContractAdapter: SmartContractAdapter;
	private poolsBackend: PoolsBackend;
	private strategiesBackend: StrategiesBackend;
	private yieldBackend: YieldBackend;
	private vaultsBackend: VaultsBackend;
	private chainId?: ChainId;

	constructor(contractFactory: ContractFactory, backendUrl: string, chainId?: ChainId) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.poolsBackend = new PoolsBackend(backendUrl, chainId || 1);
		this.strategiesBackend = new StrategiesBackend(backendUrl);
		this.yieldBackend = new YieldBackend(backendUrl, chainId || 1);
		this.vaultsBackend = new VaultsBackend(backendUrl, chainId || 1);
		this.chainId = chainId;
	}

	/**
	 * Retrieves a list of all vaults.
	 * @returns {Promise<Vault[]>} A promise that resolves to an array of vault objects.
	 */
	public async getVaults(): Promise<Vault[]> {
		return this.vaultsBackend.getVaults();
	}

	/**
	 * Retrieves the TVL of the pools.
	 * @param {string} vault - The address of the vault.
	 * @param {number[]} pools - Array of pool IDs to query.
	 * @returns {Promise<PoolsTvl[]>} A promise that resolves to an array of TVL values for each pool.
	 */
	async getPoolTvl(vault: string, pools: number[]): Promise<PoolsTvl[]> {
		const { totalAssets, totalSupply, poolsSupply } =
			await this.smartContractAdapter.yelayLiteVault.getPoolsSupplies(vault, pools);

		return poolsSupply.map((poolSupply, index) => ({
			id: pools[index],
			tvl: (totalAssets * poolSupply) / totalSupply,
		}));
	}

	/**
	 * Checks if a given pool ID is active in the specified vault.
	 *
	 * @param vault - The address of the vault contract.
	 * @param pool - The pool ID to check.
	 * @returns A promise that resolves to a boolean indicating whether the pool ID is active.
	 */
	async isPoolActive(vault: string, pool: number): Promise<boolean> {
		return this.smartContractAdapter.yelayLiteVault.poolActive(vault, pool);
	}

	/**
	 * Retrieves data about a specific client in the specified vault.
	 *
	 * @param {string} client - The address of the client.
	 * @param {string} vault - The address of the vault contract.
	 * @returns A promise that resolves to a `ClientData` object containing:
	 *   - `minPool`: The minimum pool ID associated with the client (as a number).
	 *   - `maxPool`: The maximum pool ID associated with the client (as a number).
	 *   - `clientName`: The name of the client decoded from a bytes32 string.
	 */
	async getClientData(client: string, vault: string): Promise<ClientData> {
		return this.smartContractAdapter.yelayLiteVault.clientData(client, vault);
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
	 * @returns {Promise<PaginatedResponse<HistoricalTVL>>} Resolves with a paginated response of historical TVL entries.
	 */
	public async getHistoricalTvl(params: HistoricalTVLParams): Promise<PaginatedResponse<HistoricalTVL>> {
		return await this.poolsBackend.historicalTVL(params);
	}

	/**
	 * Retrieves the yield of the vaults. If TimeFrame is not provided, then it will by default set the fromTimestamp to 1 week ago.
	 * @param {string[]} vaults - Optional array of vault addresses to filter results.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<VaultYield[]>} A promise that resolves to the yield data for the vaults.
	 */
	public async getVaultYield(vaults?: string[], timeFrame?: TimeFrame): Promise<VaultYield[]> {
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
	public async getPoolYield(vaults?: string[], pools?: number[], timeFrame?: TimeFrame): Promise<PoolYield[]> {
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
	async getAggregatedYield(
		vaults?: string[],
		pools?: number[],
		users?: string[],
		timeFrame?: TimeFrame,
	): Promise<YieldAggregated[]> {
		return await this.yieldBackend.getYields(vaults, pools, users, timeFrame);
	}

	/**
	 * Fetches all protocols from the backend.
	 *
	 * @returns {Promise<Protocol[]>} A promise that resolves to an array of protocols.
	 */
	async getProtocols(): Promise<Protocol[]> {
		const protocols = await this.strategiesBackend.getProtocols();
		return protocols.map(({ prefixes, ...rest }) => rest);
	}

	/**
	 * Fetches all active strategies for a given vault.
	 *
	 * @param {string} vault - The address of the vault.
	 * @returns {Promise<Strategy[]>} A promise that resolves to an array of strategies.
	 */
	async getActiveStrategies(vault: string): Promise<Strategy[]> {
		const protocols = await this.strategiesBackend.getProtocols();
		const totalAssets = await this.smartContractAdapter.yelayLiteVault.totalAssets(vault);
		const activeStrategies = await this.smartContractAdapter.yelayLiteVault.activeStrategies(vault);
		const result = await Promise.all(
			activeStrategies.map(async (strategy, index) => {
				const prefix = strategy.name.split('-')[0];
				const protocol = protocols.find(p => p.prefixes.includes(prefix));
				if (!protocol) {
					throw new Error(`Protocol for ${prefix} not found`);
				}
				const strategyAssets = await this.smartContractAdapter.yelayLiteVault.strategyAssets(vault, index);
				const allocation = Number((strategyAssets * BigInt(10000)) / totalAssets) / 100;
				return {
					...strategy,
					protocolId: protocol.id,
					allocation,
				};
			}),
		);
		return result;
	}
}
