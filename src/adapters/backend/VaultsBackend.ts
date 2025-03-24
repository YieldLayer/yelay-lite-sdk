import { IVaultsBackend } from '../../app/ports/backend/IVaultsBackend';
import { Vault } from '../../types/vaults';

export class VaultsBackend implements IVaultsBackend {
	private chainId: string;
	private backendUrl: string;

	constructor(backendUrl: string, chainId: number) {
		this.backendUrl = backendUrl;
		this.chainId = chainId.toString();
	}

	async getVaults(): Promise<Vault[]> {
		const searchParams = new URLSearchParams();
		searchParams.append('chainId', this.chainId);
		const result = (await fetch(`${this.backendUrl}/vaults?${searchParams.toString()}`).then(r =>
			r.json(),
		)) as Vault[];
		return result;
	}
}
