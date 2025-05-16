import { ethers } from 'ethers';
import { YelayLiteSdk } from '../../src';

describe('Yield', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		sdk = new YelayLiteSdk(provider, 8453);
	});

	it.skip('Get Yields', async () => {
		const vaultsYield = await sdk.yields.getVaultsYield(['0x16db68c86edfdb60ba733563326ed392b319eb2b'], {
			fromBlock: 1,
			toBlock: 26539965,
		});

		console.log('vaultsYield', vaultsYield);
	});

	it.skip('Get Yields', async () => {
		const yields = await sdk.yields.getYields();

		console.log('userYield', yields);
	});

	it('Get Claimable Yield', async () => {
		const claimableYield = await sdk.yields.getClaimableYield({
			user: '0x1892e547F4E1bA76F82a09C16C9F774744De1ff3',
		});

		console.log('claimableYield for user 0x1892e547F4E1bA76F82a09C16C9F774744De1ff3', claimableYield);
	}, 15000);
});
