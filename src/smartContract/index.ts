import { ContractFactory } from './ContractFactory.js';
// import { VaultWrapper } from './VaultWrapper';
import { YelayLiteVault } from './YelayLiteVault.js';
// import { YieldExtractor } from './YieldExtractor';

export class SmartContractAdapter {
	// public vaultWrapper: VaultWrapper;
	public yelayLiteVault: YelayLiteVault;
	// public yieldExtractor: YieldExtractor;

	constructor(contractFactory: ContractFactory) {
		// this.vaultWrapper = new VaultWrapper(contractFactory);
		this.yelayLiteVault = new YelayLiteVault(contractFactory);
		// this.yieldExtractor = new YieldExtractor(contractFactory);
	}
}
