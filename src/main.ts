import type { Drift } from '@delvtech/drift';
import { getEnvironment } from './environment';
import { Pools } from './services/Pools';
import { Strategies } from './services/Strategies';
import { Vaults } from './services/Vaults';
import { Yield } from './services/Yield';
import { ContractFactory } from './smartContract/ContractFactory';
import { ChainId } from './types/config';

export class YelayLiteSdk {
	private _vaults: Vaults | null = null;
	private _pools: Pools | null = null;
	private _strategies: Strategies | null = null;
	private _yield: Yield | null = null;

	async init(drift: Drift) {
		const chainId = (await drift.getChainId()) as ChainId;
		const config = getEnvironment(chainId, true);
		const contractFactory = new ContractFactory(drift, config.contracts);
		this._vaults = new Vaults(contractFactory, config.backendUrl, chainId);
		this._pools = new Pools(contractFactory, config.backendUrl, chainId);
		this._strategies = new Strategies(contractFactory, config.backendUrl);
		this._yield = new Yield(contractFactory, config.backendUrl, chainId);
	}

	get vaults(): Vaults {
		if (!this._vaults) {
			throw new Error('SDK not initialized. Call init() first.');
		}
		return this._vaults;
	}

	get pools(): Pools {
		if (!this._pools) {
			throw new Error('SDK not initialized. Call init() first.');
		}
		return this._pools;
	}

	get strategies(): Strategies {
		if (!this._strategies) {
			throw new Error('SDK not initialized. Call init() first.');
		}
		return this._strategies;
	}

	get yield(): Yield {
		if (!this._yield) {
			throw new Error('SDK not initialized. Call init() first.');
		}
		return this._yield;
	}
}
