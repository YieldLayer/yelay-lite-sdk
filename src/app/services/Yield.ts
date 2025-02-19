import { SmartContractAdapter } from '../../adapters/smartContract';
import { IContractFactory } from '../ports/IContractFactory';
import { VaultsBackend } from '../../adapters/backend/VaultsBackend';
import { ProjectYield, UserYield, UserYieldAggregatedData, VaultYield, YieldAggregated } from '../../types/yield';
import { TimeFrame } from '../../types/backend';
import { YieldBackend } from '../../adapters/backend/YieldBackend';

export class Yield {
	private smartContractAdapter: SmartContractAdapter;
	private yieldBackend: YieldBackend;

	constructor(contractFactory: IContractFactory, backendUrl: string) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
		this.yieldBackend = new YieldBackend(backendUrl);
	}

	/**
	 * Retrieves the yield of the vaults.
	 * @param {string[]} vaults - The addresses of the vaults.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<VaultYield[]>} A promise that resolves to the yield data for the vaults.
	 */
	public async getVaultsYield(vaults: string[], timeFrame: TimeFrame): Promise<VaultYield> {
		return await this.yieldBackend.getVaultsYield(vaults, timeFrame);
	}

	/**
	 * Retrieves the yield for specific projects within a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number[]} projectIds - Array of project IDs to query.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<ProjectYield[]>} A promise that resolves to an array of project yield data.
	 */
	async getProjectsYield(vault: string, projectIds: number[], timeFrame?: TimeFrame): Promise<ProjectYield[]> {
		return await this.yieldBackend.getProjectsYield(vault, projectIds, timeFrame);
	}

	/**
	 * Retrieves the yield for specific users within a project in a vault.
	 * @param {string} vault - The address of the vault.
	 * @param {number} projectId - The project ID.
	 * @param {string[]} users - Array of user addresses to query.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe for filtering yield data.
	 * @returns {Promise<UserYield[]>} A promise that resolves to an array of user yield data.
	 */
	async getUsersYield(
		vault: string,
		projectId: number,
		users: string[],
		timeFrame?: TimeFrame,
	): Promise<UserYield[]> {
		return await this.yieldBackend.getUsersYield(vault, projectId, users, timeFrame);
	}

	/**
	 * Retrieves the aggregated yield data for a specific user across multiple projects and vaults.
	 *
	 * @param {string} user - The address of the user whose yield data is being queried.
	 * @param {string[]} [vaults] - Optional array of vault addresses to filter the query.
	 * @param {number[]} [projectIds] - Optional array of projectIds to filter the query.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe to filter the yield data by specific dates or blocks.
	 * @returns {Promise<UserYieldAggregatedData[]>} A promise that resolves to an array of aggregated yield data,
	 * each containing vault address and a mapping of project IDs to yield values.
	 */
	async getUserYield(
		user: string,
		vaults?: string[],
		projectIds?: number[],
		timeFrame?: TimeFrame,
	): Promise<UserYieldAggregatedData[]> {
		return await this.yieldBackend.getUserYield(user, vaults, projectIds, timeFrame);
	}

	/**
	 * Retrieves the aggregated yield data for specified vaults, projects, and users within a given timeframe.
	 * @param {string[]} [vaults] - Optional array of vault addresses to filter results.
	 * @param {number[]} [projectIds] - Optional array of project IDs to filter results.
	 * @param {string[]} [users] - Optional array of user addresses to filter results.
	 * @param {TimeFrame} [timeFrame] - Optional timeframe to limit results within a specific period.
	 * @returns {Promise<YieldAggregated[]>} A promise that resolves to an array of aggregated yield data.
	 */
	async getYields(
		vaults?: string[],
		projectIds?: number[],
		users?: string[],
		timeFrame?: TimeFrame,
	): Promise<YieldAggregated[]> {
		return await this.yieldBackend.getYields(vaults, projectIds, users, timeFrame);
	}
}
