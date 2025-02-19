import { BigNumber, ContractTransaction, PayableOverrides, Signer } from 'ethers';
import { ClientData } from '../../../types/smartContract';

export type ProjectSupply = {
	totalAssets: BigNumber;
	totalSupply: BigNumber;
	projectsSupply: BigNumber[];
};

export interface IYelayLiteVault {
	getProjectsSupplies(vault: string, projectIds: number[]): Promise<ProjectSupply>;
	allowance(signer: Signer, vault: string): Promise<BigNumber>;
	approve(vault: string, amount: bigint): Promise<ContractTransaction>;
	deposit(signer: Signer, vault: string, projectId: number, amount: bigint): Promise<ContractTransaction>;
	redeem(signer: Signer, vault: string, projectId: number, amount: bigint): Promise<ContractTransaction>;
	migrate(vault: string, fromProjectId: number, toProjectId: number, amount: bigint): Promise<ContractTransaction>;
	activateProject(vault: string, projectId: number): Promise<ContractTransaction>;
	projectIdActive(vault: string, projectId: number): Promise<boolean>;
	clientData(client: string, vault: string): Promise<ClientData>;
	balanceOf(vault: string, projectId: number, user: string): Promise<BigNumber>;
}
