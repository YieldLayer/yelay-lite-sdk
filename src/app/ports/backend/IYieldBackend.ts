import { TimeFrame } from '../../../types/backend';
import { VaultYield, YieldAggregated } from '../../../types/yield';

export interface IYieldBackend {
	getVaultsYield(vaults?: string[], timeFrame?: TimeFrame): Promise<VaultYield[]>;
	getYields(vaults?: string[], pools?: number[], users?: string[], timeFrame?: TimeFrame): Promise<YieldAggregated[]>;
}
