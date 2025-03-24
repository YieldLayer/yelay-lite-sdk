import { ethers } from 'hardhat';
import { YelayLiteSdk } from '../src';

describe('Yield', function () {
	let sdk: YelayLiteSdk;

	before(async function () {
		const [signer] = await ethers.getSigners();
		sdk = new YelayLiteSdk(signer, 8453);
	});

	it('getVaultsYield', async () => {
		const vaultsYield = await sdk.yields.getVaultsYield(['0x16db68c86edfdb60ba733563326ed392b319eb2b'], {
			fromBlock: 1,
			toBlock: 26539965,
		});

		console.log('vaultsYield', vaultsYield);
	});

	it('getYields', async () => {
		const yields = await sdk.yields.getYields();

		console.log('userYield', yields);
	});
});
