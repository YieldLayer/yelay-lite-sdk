import type { Drift } from '@delvtech/drift';
import { getEnvironment } from './environment';
import { Vaults } from './services/Vaults';
import { ContractFactory } from './smartContract/ContractFactory';
import { ChainId } from './types/config';

export class YelayLiteSdk {
	private _vaults: Vaults | null = null;

	async init(drift: Drift) {
		const chainId = (await drift.getChainId()) as ChainId;
		const config = getEnvironment(chainId, true);
		const contractFactory = new ContractFactory(drift, config.contracts);
		this._vaults = new Vaults(contractFactory, config.backendUrl, chainId);
	}

	get vaults(): Vaults {
		if (!this._vaults) {
			throw new Error('SDK not initialized. Call init() first.');
		}
		return this._vaults;
	}
}
