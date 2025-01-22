export type YelayLiteSdkConfig = {
	backendUrl: string;
	rpcUrl: string;
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

export type EventsRange = {
	startBlock: number;
	finishBlock: number;
	startTimestamp: number;
	finishTimestamp: number;
};

export type VaultYield = EventsRange & {
	vault: string;
	yield: string;
	apy: string;
};

export type ProjectYield = EventsRange & {
	data: {
		projectId: number;
		yield: string;
	}[];
};

export type UserYield = EventsRange & {
	data: { user: string; yield: string }[];
};

export type CallResult = {
	success: boolean;
	hash?: string;
};

export type ClientData = {
	minProjectId: number;
	maxProjectId: number;
	clientName: string;
};
