import ApiWrapperService from '../services/ApiWrapperService';
import { Vault } from '../types/index';

export class VaultsBackend extends ApiWrapperService {
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
