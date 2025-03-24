import { Vault } from '../../../types/vaults';

export interface IVaultsBackend {
	getVaults(): Promise<Vault[]>;
}
