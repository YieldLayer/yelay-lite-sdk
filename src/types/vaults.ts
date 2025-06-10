export type Vault = {
	address: string;
	name: string;
	createBlocknumber: number;
	createTimestamp: number;
	underlying: string;
	chainId: number;
	pools: number[];
};
