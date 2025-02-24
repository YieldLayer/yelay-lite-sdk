import { Signer } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { SDKConfig } from './types/config';
import { IContractFactory } from './app/ports/IContractFactory';
import { ContractFactory } from './adapters/smartContract/ContractFactory';
import { Vaults } from './app/services/Vaults';
import { Yield } from './app/services/Yield';
import { Projects } from './app/services/Projects';
import {DepositLockPlugin} from './app/services/DepositLockPlugin';

export class YelayLiteSdk {
	public vaults: Vaults;
	public yields: Yield;
	public projects: Projects;
	public depositLock: DepositLockPlugin;
	public contractFactory: IContractFactory;

	constructor(signerOrProvider: Signer | Provider, sdkConfig: SDKConfig) {
		this.contractFactory = new ContractFactory(signerOrProvider, sdkConfig.contractAddresses);

		this.vaults = new Vaults(this.contractFactory, sdkConfig.backendUrl, signerOrProvider);

		this.yields = new Yield(this.contractFactory, sdkConfig.backendUrl);

		this.projects = new Projects(this.contractFactory);

        this.depositLock = new DepositLockPlugin(this.contractFactory);
	}
}
