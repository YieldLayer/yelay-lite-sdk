import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import { ContractFactory } from './adapters/smartContract/ContractFactory';
import { IContractFactory } from './app/ports/IContractFactory';
import { Pools } from './app/services/Pools';
import { Vaults } from './app/services/Vaults';
import { Yield } from './app/services/Yield';
import { getEnvironment } from './environment';
import { Environment } from './types/config';

export class YelayLiteSdk {
	public vaults: Vaults;
	public yields: Yield;
	public pools: Pools;

	constructor(signerOrProvider: Signer | Provider, environment: Environment) {
		const config = getEnvironment(environment);
		const contractFactory = new ContractFactory(signerOrProvider, config.contracts);

		this.vaults = new Vaults(contractFactory, config.backendUrl, config.chainId, signerOrProvider);

		this.yields = new Yield(config.backendUrl, config.chainId);

		this.pools = new Pools(contractFactory);
	}
}
