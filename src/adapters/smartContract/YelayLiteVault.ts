import { BigNumber, ContractTransaction, Signer } from 'ethers';
import { IContractFactory } from '../../app/ports/IContractFactory';
import { IYelayLiteVault, ProjectSupply } from '../../app/ports/smartContract/IYelayLiteVault';
import { Provider } from '@ethersproject/abstract-provider';
import { ClientData } from '../../types/smartContract';
import { parseBytes32String } from 'ethers/lib/utils';
import { getIncreasedGasLimit } from '../../utils/smartContract';

export class YelayLiteVault implements IYelayLiteVault {
	constructor(private contractFactory: IContractFactory) {}

	public async getProjectsSupplies(vault: string, projectIds: number[]): Promise<ProjectSupply> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const [totalAssets, totalSupply, ...projectsSupply] = await Promise.all([
			yelayLiteVault.totalAssets(),
			yelayLiteVault['totalSupply()'](),
			...projectIds.map(p => yelayLiteVault['totalSupply(uint256)'](p)),
		]);
		return {
			totalAssets,
			totalSupply,
			projectsSupply,
		};
	}

	async allowance(signer: Signer, vault: string): Promise<BigNumber> {
		const underlying = await this.contractFactory.getYelayLiteVault(vault).underlyingAsset();
		const userAddress = await signer.getAddress();
		return this.contractFactory.getErc20(underlying).allowance(userAddress, vault);
	}

	async approve(vault: string, amount: bigint): Promise<ContractTransaction> {
		const yelayLiteVault = this.contractFactory.getYelayLiteVault(vault);
		const underlyingAsset = await yelayLiteVault.underlyingAsset();
		const estimatedGas = await this.contractFactory.getErc20(underlyingAsset).estimateGas.approve(vault, amount);

		return this.contractFactory
			.getErc20(underlyingAsset)
			.approve(vault, amount, { gasLimit: getIncreasedGasLimit(estimatedGas) });
	}

	async deposit(signer: Signer, vault: string, projectId: number, amount: bigint): Promise<ContractTransaction> {
		const userAddress = await signer.getAddress();
		const estimatedGas = await this.contractFactory
			.getYelayLiteVault(vault)
			.estimateGas.deposit(amount, projectId, userAddress);

		return this.contractFactory
			.getYelayLiteVault(vault)
			.deposit(amount, projectId, userAddress, { gasLimit: getIncreasedGasLimit(estimatedGas) });
	}

	async redeem(signer: Signer, vault: string, projectId: number, amount: bigint): Promise<ContractTransaction> {
		const userAddress = await signer.getAddress();

		const estimatedGas = await this.contractFactory
			.getYelayLiteVault(vault)
			.estimateGas.redeem(amount, projectId, userAddress);

		return this.contractFactory
			.getYelayLiteVault(vault)
			.redeem(amount, projectId, userAddress, { gasLimit: getIncreasedGasLimit(estimatedGas) });
	}

	async migrate(
		vault: string,
		fromProjectId: number,
		toProjectId: number,
		amount: bigint,
	): Promise<ContractTransaction> {
		const estimatedGas = await this.contractFactory
			.getYelayLiteVault(vault)
			.estimateGas.migratePosition(fromProjectId, toProjectId, amount);

		return this.contractFactory
			.getYelayLiteVault(vault)
			.migratePosition(fromProjectId, toProjectId, amount, { gasLimit: getIncreasedGasLimit(estimatedGas) });
	}

	async activateProject(vault: string, projectId: number): Promise<ContractTransaction> {
		return this.contractFactory.getYelayLiteVault(vault).activateProject(projectId, { gasLimit: 300000 });
	}

	async projectIdActive(vault: string, projectId: number): Promise<boolean> {
		return this.contractFactory.getYelayLiteVault(vault).projectIdActive(projectId);
	}

	async clientData(client: string, vault: string): Promise<ClientData> {
		const result = await this.contractFactory.getYelayLiteVault(vault).ownerToClientData(client);
		return {
			minProjectId: Number(result.minProjectId),
			maxProjectId: Number(result.maxProjectId),
			clientName: parseBytes32String(result.clientName),
		};
	}

	async balanceOf(vault: string, projectId: number, user: string): Promise<BigNumber> {
		return this.contractFactory.getYelayLiteVault(vault).balanceOf(user, projectId);
	}
}
