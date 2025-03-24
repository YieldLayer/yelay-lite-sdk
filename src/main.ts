import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import { ContractFactory } from './adapters/smartContract/ContractFactory';
import { DepositLockPlugin } from './app/services/DepositLockPlugin';
import { Pools } from './app/services/Pools';
import { Vaults } from './app/services/Vaults';
import { Yield } from './app/services/Yield';
import { getEnvironment } from './environment';
import { ChainId } from './types/config';

export class YelayLiteSdk {
	public vaults: Vaults;
	public yields: Yield;
	public depositLock: DepositLockPlugin;
	public pools: Pools;
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

		this.yields = new Yield(config.backendUrl, chainId);

		this.depositLock = new DepositLockPlugin(contractFactory);

		this.pools = new Pools(contractFactory);

		this.swapperAddress = config.contracts.Swapper;
	}
}
