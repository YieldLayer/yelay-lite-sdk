import { BigNumber } from 'ethers';

export type PoolsTvl = {
	id: number;
	tvl: BigNumber;
};

export type HistoricalTVL = {
	vaultAddress: string;
	poolId: number;
	createTimestamp: number;
	assets: BigNumber;
};

export type HistoricalTVLParams = {
	vaultAddress: string;
	poolId: number;
	fromTimestamp?: number;
	toTimestamp?: number;
	page?: number;
	pageSize?: number;
};
