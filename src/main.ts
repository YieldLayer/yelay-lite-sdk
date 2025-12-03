import type { Drift } from '@gud/drift';
import { NoOpCache } from './utils/NoOpCache';
import { getEnvironment } from './environment';
import { Portfolio } from './services/Portfolio';
import { DataProvider } from './services/DataProvider';
import { ActionExecutor } from './services/ActionExecutor';
import { ContractFactory } from './smartContract/ContractFactory';
import { ChainId } from './types/config';

export class YelayLiteSdk {
	private _portfolio: Portfolio | null = null;
	private _data: DataProvider | null = null;
	private _actions: ActionExecutor | null = null;

	async init(drift: Drift, testing = false) {
		// Check if user has set a custom cache store (not the default LruStore)
		const currentStore = drift.cache.store;
		
		// Use constructor name check instead of instanceof to avoid duplicate package issues
		if (currentStore.constructor.name !== 'LruStore') {
			throw new Error('Custom caching is not allowed');
		} 
		// Disable caching by replacing the cache store with N¬oOpCache
		drift.cache.store = new NoOpCache();

		const chainId = (await drift.getChainId()) as ChainId;
		const config = getEnvironment(chainId, testing);
		const contractFactory = new ContractFactory(drift, config.contracts);

		// Initialize services with proper dependencies
		this._portfolio = new Portfolio(contractFactory, config.backendUrl, chainId);
		this._data = new DataProvider(contractFactory, config.backendUrl, chainId);
		this._actions = new ActionExecutor(contractFactory);
	}

	get portfolio(): Portfolio {
		if (!this._portfolio) {
			throw new Error('SDK not initialized. Call init() first.');
		}
		return this._portfolio;
	}

	get data(): DataProvider {
		if (!this._data) {
			throw new Error('SDK not initialized. Call init() first.');
		}
		return this._data;
	}

	get actions(): ActionExecutor {
		if (!this._actions) {
			throw new Error('SDK not initialized. Call init() first.');
		}
		return this._actions;
	}
}
