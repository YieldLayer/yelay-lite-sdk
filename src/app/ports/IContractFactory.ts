import { ERC20, IYelayLiteVault, VaultWrapper } from '../../generated/typechain';

export interface IContractFactory {
	getYelayLiteVault(vault: string): IYelayLiteVault;
	getVaultWrapper(): VaultWrapper;
	getErc20(address: string): ERC20;
}
