import { ProtocolData, StrategyVaultData } from '../../../types/strategies';

export interface IStrategiesBackend {
	getProtocols(): Promise<ProtocolData[]>;
	getStrategyVaultData(yelayLiteVault: string, strategyNames: string[]): Promise<StrategyVaultData[]>;
}
