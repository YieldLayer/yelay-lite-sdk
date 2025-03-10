import { Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { SDKConfig } from './types/config';
import { IContractFactory } from './app/ports/IContractFactory';
import { ContractFactory } from './adapters/smartContract/ContractFactory';
import { Vaults } from './app/services/Vaults';
import { Yield } from './app/services/Yield';
import { Projects } from './app/services/Projects';
import { Users } from './app/services/Users';

export class YelayLiteSdk {
	public vaults: Vaults;
	public yields: Yield;
	public projects: Projects;
	public users: Users;
	public contractFactory: IContractFactory;

	constructor(signerOrProvider: Signer | Provider, sdkConfig: SDKConfig) {
		this.contractFactory = new ContractFactory(signerOrProvider, sdkConfig.contractAddresses);

		this.vaults = new Vaults(this.contractFactory, sdkConfig.backendUrl, signerOrProvider);

		this.yields = new Yield(sdkConfig.backendUrl);

		this.projects = new Projects(this.contractFactory);

		this.users = new Users(sdkConfig.backendUrl);
	}
}
