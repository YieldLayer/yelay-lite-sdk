import { ethers } from 'ethers';
import { sdkConfig, YelayLiteSdk } from '../../src';

describe('Yield', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		const privateKey = process.env.PRIVATE_KEY ?? '';

		const signer = new ethers.Wallet(privateKey, provider);

		sdk = new YelayLiteSdk(signer, sdkConfig[8453]);
	});

	it.skip('Get Yields', async () => {
		const vaultsYield = await sdk.yields.getVaultsYield(['0x16db68c86edfdb60ba733563326ed392b319eb2b'], {
			fromBlock: 1,
			toBlock: 26539965,
		});

		console.log('vaultsYield', vaultsYield);
	});

	it.skip('Get Yields', async () => {
		const projectsYield = await sdk.yields.getProjectsYield('0x1d060a1b17a7ff1929133b202a7ec1d9b90a1965', [1], {
			fromBlock: 1,
			toBlock: 26539965,
		});

		console.log('projectsYield', projectsYield);
	});

	it.skip('Get User Yields', async () => {
		const userYield = await sdk.yields.getUserYield('0xe2816865b58a79523c16cb80092cf5591241b16d', [
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
		]);

		console.log('userYield', userYield);
	});

	it('Get Users Yields', async () => {
		const userYield = await sdk.yields.getUsersYield('0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992', 100, [
			'0xe2816865b58a79523c16cb80092cf5591241b16d',
		]);

		console.log('userYield', userYield);
	});

	it.skip('Get Yields', async () => {
		const yields = await sdk.yields.getYields();

		console.log('userYield', yields);
	});
});
