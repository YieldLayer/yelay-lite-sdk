import { IStrategiesBackend } from '../../app/ports/backend/IStrategiesBackend';
import ApiWrapperService from '../../services/ApiWrapperService';
import { ProtocolData } from '../../types/strategies';

export class StrategiesBackend extends ApiWrapperService implements IStrategiesBackend {
	constructor(backendUrl: string) {
		super(backendUrl);
	}

	async getProtocols(): Promise<ProtocolData[]> {
		return this.get<ProtocolData[]>(`/protocols`);
	}
}
