import { BigNumber, ContractTransaction, ethers, PayableOverrides } from 'ethers';
import { LibErrors__factory } from '../generated/typechain';
import { ChainId } from '../types/config';

export const tryCall = async (call: Promise<ethers.ContractTransaction>): Promise<ContractTransaction> => {
	try {
		return call;
	} catch (error: any) {
		const parsedError = LibErrors__factory.createInterface().parseError(error.data);
		if (parsedError) {
			console.error(`Error: ${parsedError.name}`);
		} else {
			console.error(`Error: ${error}`);
		}
		throw new Error(`Transaction failed: ${error instanceof Error ? error.message : error}`);
	}
};

export const getIncreasedGasLimit = (gasLimit: BigNumber) => {
	const increasedGasLimit = gasLimit.mul(120).div(100);
	return increasedGasLimit;
};

// optionally populate gasLimit via estimateGas
export async function populateGasLimit<T extends (...args: any[]) => Promise<BigNumber>>(
	fn: T,
	args: Parameters<T>,
	overrides: PayableOverrides,
) {
	try {
		if (!overrides.gasLimit) {
			// max allowed gas limit for estimation is 5 mln
			overrides.gasLimit = await fn(...args, { gasLimit: 5_000_000 }).then(getIncreasedGasLimit);
		}
	} catch (err) {
		console.error('Gas estimation failed:', err);
		throw err;
	}
}

const BLOCKS_PER_MINUTE: Record<ChainId, number> = {
	1: 5,
	146: 150,
	8453: 30,
};

const ONE_MONTH = 30 * 24 * 60;

export const getOneMonthBlockRange = (chainId: ChainId): number => {
	return BLOCKS_PER_MINUTE[chainId] * ONE_MONTH;
};
