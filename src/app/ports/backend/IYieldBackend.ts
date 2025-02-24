import { TimeFrame } from '../../../types/backend';
import { ProjectYield, UserYield, UserYieldAggregatedData, VaultYield, YieldAggregated } from '../../../types/yield';

export interface IYieldBackend {
	getVaultsYield(vaults: string[], timeFrame?: TimeFrame): Promise<VaultYield[]>;
	getProjectsYield(vault: string, projectIds: number[], timeFrame?: TimeFrame): Promise<ProjectYield>;
	getUsersYield(vault: string, projectId: number, users: string[], timeFrame?: TimeFrame): Promise<UserYield[]>;
	getUserYield(
		user: string,
		vaults?: string[],
		projectIds?: number[],
		timeFrame?: TimeFrame,
	): Promise<UserYieldAggregatedData[]>;
	getYields(
		vaults?: string[],
		projectIds?: number[],
		users?: string[],
		timeFrame?: TimeFrame,
	): Promise<YieldAggregated[]>;
}
