import { ethers } from 'ethers';
import { sdkConfig, YelayLiteSdk } from '../../src';
import { parseEther } from 'ethers/lib/utils';
import dotenv from 'dotenv';

dotenv.config();
jest.setTimeout(10000);

describe('Vaults', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		const privateKey = process.env.PRIVATE_KEY ?? '';

		const signer = new ethers.Wallet(privateKey, provider);

		sdk = new YelayLiteSdk(signer, sdkConfig[8453]);
	});

	it.skip('getVaults', async () => {
		const vaults = await sdk.vaults.getVaults(8453);

		console.log('vaults', vaults);
	});

	it('get allowance', async () => {
		const allowance = await sdk.vaults.allowance('0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992');

		console.log('allowance', allowance.toString());
	});

	it.skip('approve', async () => {
		const approve = await sdk.vaults.approve(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			BigInt(parseEther('1').toString()),
		);

		console.log('approve', approve);
	});

	it.skip('approve', async () => {
		const approve = await sdk.vaults.approve(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			BigInt(parseEther('1').toString()),
		);

		console.log('approve', approve);
	});
});
