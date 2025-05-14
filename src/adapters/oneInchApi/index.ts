import { IOneInchApi } from '../../app/ports/oneInchApi/IOneInchApi';
import ApiWrapperService from '../../services/ApiWrapperService';
import { OneInchSwapRes } from '../../types/oneInch';

export class OneInchApi extends ApiWrapperService implements IOneInchApi {
	constructor(oneInchApi: string) {
		super(oneInchApi);
	}

	public async getSwapData(
		fromTokenAddress: string,
		toTokenAddress: string,
		amountInDecimals: bigint,
		fromAddress: string,
		network: number,
		slippage = 0.1,
	): Promise<OneInchSwapRes> {
		throw new Error('Not implemented');
	}
}
