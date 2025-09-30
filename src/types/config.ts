export type ChainId = 1 | 146 | 8453 | 42161 | 43114;

export type ContractAddresses = {
	VaultWrapper: string;
	Swapper: string;
	YieldExtractor: string;
};

export type SDKConfig = {
	backendUrl: string;
	contracts: ContractAddresses;
};
