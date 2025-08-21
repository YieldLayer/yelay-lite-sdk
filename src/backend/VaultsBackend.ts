import ApiWrapperService from '../services/ApiWrapperService.js';
import { Vault } from '../types/index.js';

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
