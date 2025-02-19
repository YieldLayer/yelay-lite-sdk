import { IContractFactory } from '../../app/ports/IContractFactory';
import { VaultWrapper } from './VaultWrapper';
import { IVaultWrapper } from '../../app/ports/smartContract/IVaultWrapper';
import { IYelayLiteVault } from '../../app/ports/smartContract/IYelayLiteVault';
import { YelayLiteVault } from './YelayLiteVault';

export class SmartContractAdapter {
	public vaultWrapper: IVaultWrapper;
	public yelayLiteVault: IYelayLiteVault;

	constructor(contractFactory: IContractFactory) {
		this.vaultWrapper = new VaultWrapper(contractFactory);
		this.yelayLiteVault = new YelayLiteVault(contractFactory);
	}
}
