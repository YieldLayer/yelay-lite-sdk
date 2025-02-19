import { ethers } from 'ethers';
import { sdkConfig, YelayLiteSdk } from '../../src';

describe('Projects', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		const privateKey = process.env.PRIVATE_KEY ?? '';

		const signer = new ethers.Wallet(privateKey, provider);

		sdk = new YelayLiteSdk(signer, sdkConfig[8453]);
	});

	it('get allowance', async () => {
		const projectTvl = await sdk.projects.getProjectsTvl('0x16db68c86edfdb60ba733563326ed392b319eb2b', [1, 2]);

		console.log('projectTvl', projectTvl.projectsSupply[0].supply.toString());
	});
});
