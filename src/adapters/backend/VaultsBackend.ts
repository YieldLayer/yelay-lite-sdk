import ApiWrapperService from '../../services/ApiWrapperService';
import { IVaultsBackend } from '../../app/ports/backend/IVaultsBackend';
import { Vault } from '../../types/vaults';

export class VaultsBackend extends ApiWrapperService implements IVaultsBackend {
	private chainId: string;

	constructor(backendUrl: string, chainId: number) {
		super(backendUrl);
		this.chainId = chainId.toString();
	}

	async getVaults(): Promise<Vault[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('chainId', this.chainId);
		return this.get<Vault[]>(`/vaults?${searchParams.toString()}`);
	}
}
