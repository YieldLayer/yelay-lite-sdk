import { ProtocolData } from '../../../types/strategies';

export interface IStrategiesBackend {
	getProtocols(): Promise<ProtocolData[]>;
}
