export type ContractAddresses = {
	VaultWrapper: string;
	Swapper: string;
};

export type SDKConfig = {
	backendUrl: string;
	contractAddresses: ContractAddresses;
	chainId: number;
};
