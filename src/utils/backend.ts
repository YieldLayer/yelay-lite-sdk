import { TimeFrame } from '../types/index';

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

export const getTimestampOneWeekAgo = () => {
	const nowMs = Date.now();
	const nowSec = Math.floor(nowMs / 1000);
	const secondsInAMinute = 60;
	const minutesInAnHour = 60;
	const hoursInADay = 24;
	const daysInAWeek = 7;
	const secondsInAnHour = minutesInAnHour * secondsInAMinute;
	const secondsInADay = hoursInADay * secondsInAnHour;
	const secondsInAWeek = daysInAWeek * secondsInADay;
	const pastTimestamp = nowSec - secondsInAWeek;

	return pastTimestamp;
};
