export type Environment = 'base' | 'base-testing';

export type ContractAddresses = {
	VaultWrapper: string;
	Swapper: string;
};

export type SDKConfig = {
	backendUrl: string;
	contracts: ContractAddresses;
	chainId: number;
};
