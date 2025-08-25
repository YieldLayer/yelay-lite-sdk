import { Address } from '@delvtech/drift';

export type Vault = {
	address: Address;
	name: string;
	createBlocknumber: number;
	createTimestamp: number;
	underlying: Address;
	chainId: number;
	pools: number[];
};
