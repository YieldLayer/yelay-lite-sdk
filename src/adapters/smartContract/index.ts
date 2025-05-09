import { IContractFactory } from '../../app/ports/IContractFactory';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';
import { IYelayLiteVault } from '../../app/ports/smartContract/IYelayLiteVault';
import { IYieldExtractor } from '../../app/ports/smartContract/IYieldExtractor';
import { VaultWrapper } from './VaultWrapper';
import { YelayLiteVault } from './YelayLiteVault';
import { YieldExtractor } from './YieldExtractor';

export class SmartContractAdapter {
	public vaultWrapper: IVaultWrapper;
	public yelayLiteVault: IYelayLiteVault;
	public yieldExtractor: IYieldExtractor;

	constructor(contractFactory: IContractFactory) {
		this.vaultWrapper = new VaultWrapper(contractFactory);
		this.yelayLiteVault = new YelayLiteVault(contractFactory);
		this.yieldExtractor = new YieldExtractor(contractFactory);
	}
}
