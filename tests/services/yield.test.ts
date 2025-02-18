import { ethers } from 'ethers';
import { sdkConfig, YelayLiteSdk } from '../src';

describe('Yield', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		const privateKey = '2f3242e28d3f87c79aa73ca4f3f9c7712afd80e2e3ed991c3b0379d32b2fb3b1';

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
		const userYield = await sdk.yields.getUserYield('0x1de03a3d77641b60fc7b0e605db1926f23a2b588');

		console.log('userYield', userYield);
	});

	it.skip('Get Users Yields', async () => {
		const userYield = await sdk.yields.getUsersYield('0x16db68c86edfdb60ba733563326ed392b319eb2b', 1, [
			'0x1de03a3d77641b60fc7b0e605db1926f23a2b588',
		]);

		console.log('userYield', userYield);
	});

	it('Get Yields', async () => {
		const yields = await sdk.yields.getYields();

		console.log('userYield', yields);
	});
});
