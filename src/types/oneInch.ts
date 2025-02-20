export type OneInchSwapRes = {
	srcToken: {
		symbol: string;
		name: string;
		address: string;
		decimals: number;
		logoURI: string;
	};
	dstToken: {
		symbol: string;
		name: string;
		address: string;
		decimals: number;
		logoURI: string;
	};
	dstAmount: string;
	protocols: string[];
	tx: {
		from: string;
		to: string;
		data: string;
		value: string;
		gasPrice: string;
		gas: number;
	};
};
