export type ChainId = 1;

export type ContractAddresses = {
	VaultWrapper: string;
	Swapper: string;
	YieldExtractor: string;
};

export type SDKConfig = {
	backendUrl: string;
	contracts: ContractAddresses;
};
