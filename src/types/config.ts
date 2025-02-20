export type ContractAddresses = {
	YelayLiteVault: string;
	VaultWrapper: string;
	Swapper: string;
};

export type SDKConfig = {
	backendUrl: string;
	contractAddresses: ContractAddresses;
	chainId: number;
};
