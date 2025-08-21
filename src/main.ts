import type { Drift } from '@delvtech/drift';
import { getEnvironment } from './environment.js';
import { ChainId } from './types/config.js';

export class YelayLiteSdk {
	private drift: Drift;
	private testing: boolean;
	// public vaults: Vaults;
	// public yields: Yield;
	// public pools: Pools;
	// public strategies: Strategies;
	// TODO: remove after integrating gathering swapCalldata into the flow
	// public swapperAddress: string;

	constructor(drift: Drift, testing = false) {
		this.drift = drift;
		this.testing = testing;

		// this.vaults = new Vaults(contractFactory, config.backendUrl, chainId, signerOrProvider);

		// this.yields = new Yield(contractFactory, config.backendUrl, chainId, signerOrProvider);

		// this.pools = new Pools(contractFactory, config.backendUrl, chainId);

		// this.strategies = new Strategies(contractFactory, config.backendUrl);

		// this.swapperAddress = config.contracts.Swapper;
	}

	async init() {
		const chainId = (await this.drift.getChainId()) as ChainId;
		const config = getEnvironment(chainId, this.testing);
	}
}
