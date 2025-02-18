export type TimeFrame = {
	fromBlock?: number;
	toBlock?: number;
	fromTimestamp?: number;
	toTimestamp?: number;
};

export type EventsRange = {
	startBlock: number;
	finishBlock: number;
	startTimestamp: number;
	finishTimestamp: number;
};
