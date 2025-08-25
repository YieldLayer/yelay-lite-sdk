export type PoolsTvl = {
	id: number;
	tvl: bigint;
};

export type HistoricalTVL = {
	vaultAddress: string;
	poolId: number;
	createTimestamp: number;
	assets: bigint;
};

export type HistoricalTVLParams = {
	vaultAddress: string;
	poolId: number;
	fromTimestamp?: number;
	toTimestamp?: number;
	page?: number;
	pageSize?: number;
};
