import { TimeFrame } from '../types/index.js';

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

export const decodeBytes32ToString = (bytes32: string): string => {
	const hex = bytes32.startsWith('0x') ? bytes32.slice(2) : bytes32;
	let result = '';
	for (let i = 0; i < hex.length; i += 2) {
		const byte = parseInt(hex.substring(i, i + 2), 16);
		if (byte === 0) break;
		result += String.fromCharCode(byte);
	}
	return result;
};

export const QUERY_EVENTS_BLOCK_RANGE = 10_000;
