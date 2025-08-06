import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Strategies', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		sdk = new YelayLiteSdk(provider, 8453, true);
	});

	it.skip('get protocols', async () => {
		const protocols = await sdk.strategies.getProtocols();

		console.log(protocols);
	});

	it.skip('active strategies', async () => {
		const activeStrategies = await sdk.strategies.getActiveStrategies('0x7b3D25c37c6ADf650F1f7696be2278cCFa2b638F');

		console.log(JSON.stringify(activeStrategies, null, 2));
	});
});
