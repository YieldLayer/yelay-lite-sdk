import { ethers } from 'ethers';

export type YelayLiteSdkConfig = {
	backendUrl: string;
	signer: ethers.Signer;
};

export type Vault = {
	address: string;
	name: string;
	createBlocknumber: string;
	createTimestamp: string;
};

export type TimeFrame = {
	fromBlock?: number;
	toBlock?: number;
	fromTimestamp?: number;
	toTimestamp?: number;
};

export type VaultYield = {
	vault: string;
	yield: string;
	apy: string;
};

export type ProjectYield = {
	projectId: number;
	yield: string;
};

export type UserYield = {
	user: string;
	yield: string;
};

export type CallResult = {
	success: boolean;
	hash?: string;
};
