import { ethers } from 'ethers';
import { sdkConfig, YelayLiteSdk } from '../../src';

describe('Vaults', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		const privateKey = '2f3242e28d3f87c79aa73ca4f3f9c7712afd80e2e3ed991c3b0379d32b2fb3b1';

		const signer = new ethers.Wallet(privateKey, provider);

		sdk = new YelayLiteSdk(signer, sdkConfig[8453]);
	});

	it('getVaults', async () => {
		const vaults = await sdk.vaults.getVaults(8453);

		console.log('vaults', vaults);
	});

	it('get allowance', async () => {
		const allowance = await sdk.vaults.allowance('0x16db68c86edfdb60ba733563326ed392b319eb2b');

		console.log('allowance', allowance);
	});
});
