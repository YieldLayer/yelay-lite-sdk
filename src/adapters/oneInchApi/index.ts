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

		// console.log(
		// 	`/swap/v6.0/${network.toString()}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amountInDecimals.toString()}&fromAddress=${fromAddress}&slippage=${slippage}&disableEstimate=true&allowPartialFill=false&includeTokensInfo=true`,
		// );
		// const res: { data: OneInchSwapRes } = await this.axios.get('', {
		// 	params: {
		// 		getRequest: `/swap/v6.0/${network.toString()}/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${amountInDecimals.toString()}&fromAddress=${fromAddress}&slippage=${slippage}&disableEstimate=true&allowPartialFill=false&includeTokensInfo=true`,
		// 	},
		// });
		// return res.data;
	}
}
