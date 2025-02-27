import { SmartContractAdapter } from '../../adapters/smartContract';
import { IContractFactory } from '../ports/IContractFactory';
import { ProjectsTVL } from '../../types/projects';

export class Projects {
	private smartContractAdapter: SmartContractAdapter;

	constructor(contractFactory: IContractFactory) {
		this.smartContractAdapter = new SmartContractAdapter(contractFactory);
	}

	/**
	 * Retrieves the total assets, total supply, projects supply, as well as projects TVL.
	 * @param {string} vault - The address of the vault.
	 * @param {number[]} projectIds - Array of project IDs to query.
	 * @returns {Promise<ethers.BigNumber[]>} A promise that resolves to an array of TVL values for each project.
	 */
	async getProjectsTvl(vault: string, projectIds: number[]): Promise<ProjectsTVL> {
		const { totalAssets, totalSupply, projectsSupply } =
			await this.smartContractAdapter.yelayLiteVault.getProjectsSupplies(vault, projectIds);

		return {
			totalAssets,
			totalSupply,
			projectsSupply: projectsSupply.map((projectSupply, index) => {
				return {
					id: projectIds[index],
					supply: projectSupply,
				};
			}),
			projectsTVL: projectsSupply.map((projectSupply, index) => {
				return {
					id: projectIds[index],
					tvl: totalAssets.mul(projectSupply).div(totalSupply),
				};
			}),
		};
	}
}
