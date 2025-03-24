import { SmartContractAdapter } from '../../adapters/smartContract';
import { IContractFactory } from '../ports/IContractFactory';
import { PoolsTvl } from '../../types/pools';

export class Pools {
	private smartContractAdapter: SmartContractAdapter;

	constructor(contractFactory: IContractFactory) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
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
}
