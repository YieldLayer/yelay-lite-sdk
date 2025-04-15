import { expect } from 'chai';
import { ethers } from 'hardhat';
import { YelayLiteSdk } from '../src';

describe('Pools', function () {
	let sdk: YelayLiteSdk;
	const vaultAddress = '0x16db68c86edfdb60ba733563326ed392b319eb2b';

	before(async function () {
		const [signer] = await ethers.getSigners();
		sdk = new YelayLiteSdk(signer, 8453, true);
	});

	it('should retrieve project TVL', async function () {
		const pools = [1, 2];

		const poolsTvl = await sdk.pools.getPoolsTvl(vaultAddress, pools);
		expect(poolsTvl[0].tvl.gt(0)).to.be.true;
	});
});
