import { IYieldBackend } from '../../app/ports/backend/IYieldBackend';
import ApiWrapperService from '../../services/ApiWrapperService';
import { TimeFrame } from '../../types/backend';
import { ProjectYield, UserYield, UserYieldAggregatedData, VaultYield, YieldAggregated } from '../../types/yield';
import { appendTimeFrameQuery } from '../../utils/backend';

export class YieldBackend extends ApiWrapperService implements IYieldBackend {
	constructor(backendUrl: string) {
		super(backendUrl);
	}

	async getVaultsYield(vaults: string[], timeFrame: TimeFrame): Promise<VaultYield> {
		const searchParams = new URLSearchParams();
		vaults.forEach(vault => searchParams.append('address', vault.toString()));
		const appendedSearchParams = appendTimeFrameQuery(searchParams, timeFrame);
		console.log(
			'`/interest/vaults?${appendedSearchParams.toString()}`',
			`/interest/vaults?${appendedSearchParams.toString()}`,
		);
		const res: { data: VaultYield } = await this.axios.get(`/interest/vaults?${appendedSearchParams.toString()}`);

		return await res.data;
	}

	async getProjectsYield(vault: string, projectIds: number[], timeFrame?: TimeFrame): Promise<ProjectYield[]> {
		const searchParams = new URLSearchParams();
		projectIds.forEach(project => searchParams.append('id', project.toString()));
		const appendedSearchParams = appendTimeFrameQuery(searchParams, timeFrame);
		const res: { data: ProjectYield[] } = await this.axios.get(
			`/interest/vault/${vault}/projects?${appendedSearchParams.toString()}`,
		);
		return await res.data;
	}

	async getUsersYield(
		vault: string,
		projectId: number,
		users: string[],
		timeFrame?: TimeFrame,
	): Promise<UserYield[]> {
		const searchParams = new URLSearchParams();
		users.forEach(user => searchParams.append('user', user.toString()));
		const appendedSearchParams = appendTimeFrameQuery(searchParams, timeFrame);
		const res: { data: UserYield[] } = await this.axios.get(
			`/interest/vault/${vault}/project/${projectId}/users?${appendedSearchParams.toString()}`,
		);
		return await res.data;
	}

	async getUserYield(
		user: string,
		vaults?: string[],
		projectIds?: number[],
		timeFrame?: TimeFrame,
	): Promise<UserYieldAggregatedData[]> {
		const searchParams = new URLSearchParams();
		vaults?.forEach(v => searchParams.append('v', v.toLowerCase()));
		projectIds?.forEach(projectId => searchParams.append('p', projectId.toString()));
		const appendedSearchParams = appendTimeFrameQuery(searchParams, timeFrame);
		const res: { data: UserYieldAggregatedData[] } = await this.axios.get(
			`/interest/user/${user}?${appendedSearchParams.toString()}`,
		);
		return await res.data;
	}

	async getYields(
		vaults?: string[],
		projectIds?: number[],
		users?: string[],
		timeFrame?: TimeFrame,
	): Promise<YieldAggregated[]> {
		const searchParams = new URLSearchParams();
		vaults?.forEach(vault => searchParams.append('v', vault.toLowerCase()));
		projectIds?.forEach(project => searchParams.append('p', project.toString()));
		users?.forEach(user => searchParams.append('u', user.toString()));
		const appendedSearchParams = appendTimeFrameQuery(searchParams, timeFrame);
		const res: { data: YieldAggregated[] } = await this.axios.get(
			`/interest/users?${appendedSearchParams.toString()}`,
		);
		return await res.data;
	}
}
