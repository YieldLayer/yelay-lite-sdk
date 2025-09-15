import { IStrategiesBackend } from '../../app/ports/backend/IStrategiesBackend';
import ApiWrapperService from '../../services/ApiWrapperService';
import { ProtocolData, StrategyVaultData } from '../../types/strategies';

export class StrategiesBackend extends ApiWrapperService implements IStrategiesBackend {
	private chainId: string;

	constructor(backendUrl: string, chainId: number) {
		super(backendUrl);
		this.chainId = chainId.toString();
	}

	async getProtocols(): Promise<ProtocolData[]> {
		return this.get<ProtocolData[]>(`/protocols`);
	}

	async getStrategyVaultData(yelayLiteVault: string, strategyNames: string[]): Promise<StrategyVaultData[]> {
		const params = new URLSearchParams({
			chainId: this.chainId,
			v: yelayLiteVault,
			n: strategyNames.join(','),
		});
		return this.get<StrategyVaultData[]>(`/strategy-vault?${params.toString()}`);
	}
}
