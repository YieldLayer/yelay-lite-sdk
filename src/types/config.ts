export type ChainId = 1 | 8453;

export type ContractAddresses = {
	VaultWrapper: string;
	Swapper: string;
};

export type SDKConfig = {
	backendUrl: string;
	contracts: ContractAddresses;
};
