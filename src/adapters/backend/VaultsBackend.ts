import ApiWrapperService from '../../services/ApiWrapperService';
import { IVaultsBackend } from '../../app/ports/backend/IVaultsBackend';
import { Vault } from '../../types/vaults';

export class VaultsBackend extends ApiWrapperService implements IVaultsBackend {
	constructor(backendUrl: string) {
		super(backendUrl);
	}

	async getVaults(chainId: number | string): Promise<Vault[]> {
		const searchParams = new URLSearchParams({ chainId: chainId.toString() }).toString();
		const res: { data: Vault[] } = await this.axios.get(`/vaults/?${searchParams}`);
		return res.data;
	}
}
