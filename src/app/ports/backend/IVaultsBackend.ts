import { Vault } from '../../../types/vaults';

export interface IVaultsBackend {
	getVaults(chainId: number | string): Promise<Vault[]>;
}
