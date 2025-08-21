import { HexString } from '@delvtech/drift';
import { YieldBackend } from '../backend/YieldBackend.js';
import { ContractFactory } from '../smartContract/ContractFactory.js';
import { SmartContractAdapter } from '../smartContract/index.js';
import { TimeFrame } from '../types/backend.js';
import { ChainId } from '../types/config.js';
import {
	ClaimRequest,
	ClaimRequestParams,
	ClaimableYield,
	GetLastClaimEventParams,
	PoolYield,
	VaultYield,
	YieldAggregated,
} from '../types/yield.js';
import { getTimestampOneWeekAgo } from '../utils/backend.js';

export class Yield {
	private smartContractAdapter: SmartContractAdapter;
	private yieldBackend: YieldBackend;
	private chainId: ChainId;

	constructor(contractFactory: ContractFactory, backendUrl: string, chainId: ChainId) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.yieldBackend = new YieldBackend(backendUrl, chainId);
		this.chainId = chainId;
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

	async getLastClaimEvent(params: GetLastClaimEventParams) {
		// TODO:
		const lastClaimEvent = await this.smartContractAdapter.yieldExtractor.getLastClaimEvent(
			params.user,
			params.vault.address,
			params.poolId,
			params.vault.createBlocknumber,
			0,
		);
		if (!lastClaimEvent) {
			return null;
		}
		return {
			blockNumber: lastClaimEvent.blockNumber,
			transactionHash: lastClaimEvent.transactionHash,
		};
	}

	async getClaimableYield(params: ClaimRequestParams): Promise<ClaimableYield[]> {
		const claimRequests = await this.yieldBackend.getClaimRequests(params);

		const claimedShares = await Promise.all(
			claimRequests.map(c =>
				this.smartContractAdapter.yieldExtractor.getClaimedShares(params.user, c.yelayLiteVault, c.pool),
			),
		);

		return claimRequests.map((c, i) => {
			const claimable = BigInt(c.yieldSharesTotal) - claimedShares[i];
			return {
				claimable: claimable.toString(),
				claimed: claimedShares[i].toString(),
				claimRequest: c,
			};
		});
	}

	async claimYield(claimRequests: ClaimRequest[]): Promise<HexString> {
		return this.smartContractAdapter.yieldExtractor.claim(claimRequests);
	}
}
