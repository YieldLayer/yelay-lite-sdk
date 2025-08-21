import { Provider } from '@ethersproject/providers';
import { Signer } from 'ethers';
import { Pools } from './services/Pools';
import { Vaults } from './services/Vaults';
import { Yield } from './services/Yield';
import { Strategies } from './services/Strategies';
import { getEnvironment } from './environment';
import { ChainId } from './types/config';
import { ContractFactory } from './smartContract/ContractFactory';

export class YelayLiteSdk {
	public vaults: Vaults;
	public yields: Yield;
	public pools: Pools;
	public strategies: Strategies;
	// TODO: remove after integrating gathering swapCalldata into the flow
	public swapperAddress: string;

	/**
	 * Creates a new instance of YelayLiteSdk.
	 *
	 * For chainId 8453, the Base testing environment is supported when the testing parameter is set to true.
	 * For all other chainIds, only the production environment is available regardless of the testing flag.
	 *
	 * @param {Signer | Provider} signerOrProvider - A signer or provider instance for interacting with contracts.
	 * @param {ChainId} chainId - The network chainId.
	 * @param {boolean} [testing=false] - If true and chainId is 8453, uses the testing environment; otherwise, production is used.
	 */
	constructor(signerOrProvider: Signer | Provider, chainId: ChainId, testing = false) {
		const config = getEnvironment(chainId, testing);
		const contractFactory = new ContractFactory(signerOrProvider, config.contracts);

		this.vaults = new Vaults(contractFactory, config.backendUrl, chainId, signerOrProvider);

		this.yields = new Yield(contractFactory, config.backendUrl, chainId, signerOrProvider);

		this.pools = new Pools(contractFactory, config.backendUrl, chainId);

		this.strategies = new Strategies(contractFactory, config.backendUrl);

		this.swapperAddress = config.contracts.Swapper;
	}
}
