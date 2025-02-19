import { TimeFrame } from '../types';

export const appendTimeFrameQuery = (searchParams: URLSearchParams, timeframe?: TimeFrame) => {
	if (timeframe?.fromBlock) {
		searchParams.append('fromBlock', timeframe.fromBlock.toString());
	}
	if (timeframe?.toBlock) {
		searchParams.append('toBlock', timeframe.toBlock.toString());
	}
	if (timeframe?.fromTimestamp) {
		searchParams.append('fromTimestamp', timeframe.fromTimestamp.toString());
	}
	if (timeframe?.toTimestamp) {
		searchParams.append('toTimestamp', timeframe.toTimestamp.toString());
	}

	return searchParams;
};
