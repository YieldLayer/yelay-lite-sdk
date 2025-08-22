import { SmartContractAdapter } from '../smartContract/index';
import { ContractFactory } from '../smartContract/ContractFactory';
import { YieldBackend } from '../backend/YieldBackend';
import { ChainId } from '../types/config';
import { ClaimRequestParams, ClaimableYield, GetLastClaimEventParams } from '../types/yield';

export class Portfolio {
	private smartContractAdapter: SmartContractAdapter;
	private yieldBackend: YieldBackend;

	constructor(contractFactory: ContractFactory, backendUrl: string, chainId: ChainId) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.yieldBackend = new YieldBackend(backendUrl, chainId);
	}

	/**
	 * Retrieves the balance of a user for a specific pool within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} pool - The ID of the pool.
	 * @param {string} user - The address of the user.
	 * @returns {Promise<bigint>} A promise that resolves to the balance of the user in the specified pool.
	 */
	async getBalance(vault: string, pool: number, user: string): Promise<bigint> {
		return this.smartContractAdapter.yelayLiteVault.balanceOf(vault, pool, user);
	}

	/**
	 * Retrieves the allowance of the vault to spend the user's underlying asset.
	 * @param {string} vault - The address of the vault contract.
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async getAllowance(vault: string): Promise<bigint> {
		return this.smartContractAdapter.yelayLiteVault.allowance(vault);
	}

	/**
	 * Retrieves the allowance of the vault wrapper to spend the user's tokens.
	 * @param {string} tokenAddress - Token address
	 * @returns {Promise<bigint>} A promise that resolves to the allowance amount as a bigint.
	 */
	public async getTokenAllowance(tokenAddress: string): Promise<bigint> {
		return this.smartContractAdapter.vaultWrapper.vaultWrapperAllowance(tokenAddress);
	}

	/**
	 * Retrieves claimable yield information for a user.
	 * @param {ClaimRequestParams} params - Parameters for querying claimable yield.
	 * @returns {Promise<ClaimableYield[]>} A promise that resolves to claimable yield data.
	 */
	async getClaimable(params: ClaimRequestParams): Promise<ClaimableYield[]> {
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

	/**
	 * Retrieves the last claim event for a user.
	 * @param {GetLastClaimEventParams} params - Parameters for querying last claim event.
	 * @returns A promise that resolves to the last claim event data or null.
	 */
	async getLastClaim(params: GetLastClaimEventParams) {
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
}
