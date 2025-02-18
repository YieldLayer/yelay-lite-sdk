import { ContractTransaction, ethers } from 'ethers';
import { LibErrors__factory } from '../generated/typechain';

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
