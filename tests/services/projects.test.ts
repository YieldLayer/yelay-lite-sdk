import { ethers } from 'ethers';
import { sdkConfig, YelayLiteSdk } from '../../src';
import dotenv from 'dotenv';

dotenv.config();

describe('Projects', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		const privateKey = process.env.PRIVATE_KEY ?? '';

		const signer = new ethers.Wallet(privateKey, provider);

		sdk = new YelayLiteSdk(signer, sdkConfig[8453]);
	});

	it('get projectsTVL', async () => {
		const projectTvl = await sdk.projects.getProjectsTvl('0x16db68c86edfdb60ba733563326ed392b319eb2b', [1, 2]);

		console.log('projectTvl1', projectTvl.projectsTVL[0].tvl.toString());
		console.log('projectTvl2', projectTvl.projectsTVL[1].tvl.toString());
	});
});
