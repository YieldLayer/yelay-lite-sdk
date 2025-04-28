export type TimestampFrame = {
	fromTimestamp?: number;
	toTimestamp?: number;
};

export type TimeFrame = {
	fromBlock?: number;
	toBlock?: number;
} & TimestampFrame;

export type EventsRange = {
	startBlock: number;
	finishBlock: number;
	startTimestamp: number;
	finishTimestamp: number;
};

export type PaginationParams = {
	page?: string;
	pageSize?: string;
};

export enum SortOrder {
	ASC = 'ASC',
	DESC = 'DESC',
}
