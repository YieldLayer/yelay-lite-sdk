import { OneInchSwapRes } from '../../../types/oneInch';

export interface IOneInchApi {
	getSwapData(
		fromTokenAddress: string,
		toTokenAddress: string,
		amountInDecimals: bigint,
		fromAddress: string,
		network: number,
		slippage?: number,
	): Promise<OneInchSwapRes>;
}
