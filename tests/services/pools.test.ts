import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { YelayLiteSdk } from '../../src';

dotenv.config();

describe('Pools', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		sdk = new YelayLiteSdk(provider, 'base-testing');
	});

	it('get projectsTVL', async () => {
		const projectTvl = await sdk.pools.getPoolsTvl('0x16db68c86edfdb60ba733563326ed392b319eb2b', [1, 2]);

		console.log('projectTvl1', projectTvl[0].tvl.toString());
		console.log('projectTvl2', projectTvl[1].tvl.toString());
	});
});
