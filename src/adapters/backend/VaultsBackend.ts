import ApiWrapperService from '../../services/ApiWrapperService';
import { IVaultsBackend } from '../../app/ports/backend/IVaultsBackend';
import { Vault } from '../../types/vaults';

export class VaultsBackend extends ApiWrapperService implements IVaultsBackend {
	constructor(backendUrl: string) {
		super(backendUrl);
	}

	async getVaults(): Promise<Vault[]> {
		const res: { data: Vault[] } = await this.axios.get(`/v2/vaults`);
		return res.data;
	}
}
