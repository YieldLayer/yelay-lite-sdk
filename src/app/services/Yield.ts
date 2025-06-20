import { Provider } from '@ethersproject/providers';
import { BigNumber, ContractTransaction, Overrides, Signer } from 'ethers';
import { YieldBackend } from '../../adapters/backend/YieldBackend';
import { SmartContractAdapter } from '../../adapters/smartContract';
import { TimeFrame } from '../../types/backend';
import { ChainId } from '../../types/config';
import {
	ClaimRequest,
	ClaimRequestParams,
	ClaimableYield,
	GetLastClaimEventParams,
	PoolYield,
	VaultYield,
	YieldAggregated,
} from '../../types/yield';
import { getTimestampOneWeekAgo } from '../../utils/backend';
import { tryCall } from '../../utils/smartContract';
import { IYieldBackend } from '../ports/backend/IYieldBackend';
import { IContractFactory } from '../ports/IContractFactory';

export class Yield {
	private smartContractAdapter: SmartContractAdapter;
	private yieldBackend: IYieldBackend;
	private signerOrProvider: Signer | Provider;
	private chainId: ChainId;

	constructor(
		contractFactory: IContractFactory,
		backendUrl: string,
		chainId: ChainId,
		signerOrProvider: Signer | Provider,
	) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.yieldBackend = new YieldBackend(backendUrl, chainId);
		this.signerOrProvider = signerOrProvider;
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
		let latestBlock = 0;
		if (Signer.isSigner(this.signerOrProvider)) {
			latestBlock = await this.signerOrProvider.provider!.getBlockNumber();
		} else {
			latestBlock = await this.signerOrProvider.getBlockNumber();
		}

		const lastClaimEvent = await this.smartContractAdapter.yieldExtractor.getLastClaimEvent(
			params.user,
			params.vault.address,
			params.poolId,
			params.vault.createBlocknumber,
			latestBlock,
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
			const claimable = BigNumber.from(c.yieldSharesTotal).sub(claimedShares[i]);
			return {
				claimable: claimable.toString(),
				claimed: claimedShares[i].toString(),
				claimRequest: c,
			};
		});
	}

	async claimYield(claimRequests: ClaimRequest[], overrides?: Overrides): Promise<ContractTransaction> {
		return tryCall(this.smartContractAdapter.yieldExtractor.claim(claimRequests, overrides));
	}
}
