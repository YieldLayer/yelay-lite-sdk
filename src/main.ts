import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'ethers';
import { ContractFactory } from './adapters/smartContract/ContractFactory';
import { IContractFactory } from './app/ports/IContractFactory';
import { Pools } from './app/services/Pools';
import { Vaults } from './app/services/Vaults';
import { Yield } from './app/services/Yield';
import { SDKConfig } from './types/config';

export class YelayLiteSdk {
	public vaults: Vaults;
	public yields: Yield;
	public pools: Pools;
	public contractFactory: IContractFactory;

	constructor(signerOrProvider: Signer | Provider, sdkConfig: SDKConfig) {
		this.contractFactory = new ContractFactory(signerOrProvider, sdkConfig.contractAddresses);

		this.vaults = new Vaults(this.contractFactory, sdkConfig.backendUrl, signerOrProvider);

		this.yields = new Yield(sdkConfig.backendUrl);

		this.pools = new Pools(this.contractFactory);
	}
}
