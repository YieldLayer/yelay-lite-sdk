import { ContractFactory } from './ContractFactory';
import { VaultWrapper } from './VaultWrapper';
import { YelayLiteVault } from './YelayLiteVault';
import { YieldExtractor } from './YieldExtractor';

export class SmartContractAdapter {
	public vaultWrapper: VaultWrapper;
	public yelayLiteVault: YelayLiteVault;
	public yieldExtractor: YieldExtractor;

	constructor(contractFactory: ContractFactory) {
		this.vaultWrapper = new VaultWrapper(contractFactory);
		this.yelayLiteVault = new YelayLiteVault(contractFactory);
		this.yieldExtractor = new YieldExtractor(contractFactory);
	}
}
