import ApiWrapperService from '../services/ApiWrapperService.js';
import { ProtocolData } from '../types/strategies.js';

export class StrategiesBackend extends ApiWrapperService {
	constructor(backendUrl: string) {
		super(backendUrl);
	}

	async getProtocols(): Promise<ProtocolData[]> {
		return this.get<ProtocolData[]>(`/protocols`);
	}
}
