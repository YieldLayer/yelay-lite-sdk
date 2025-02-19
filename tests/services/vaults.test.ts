import { ethers } from 'ethers';
import { sdkConfig, YelayLiteSdk } from '../../src';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import dotenv from 'dotenv';

dotenv.config();
jest.setTimeout(200000);

describe('Vaults', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.meowrpc.com');

		const privateKey = process.env.PRIVATE_KEY ?? '';

		const signer = new ethers.Wallet(privateKey, provider);

		sdk = new YelayLiteSdk(signer, sdkConfig[8453]);
	});

	it.skip('getVaults', async () => {
		const vaults = await sdk.vaults.getVaults(8453);

		console.log('vaults', vaults);
	});

	it.skip('get allowance', async () => {
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

	it.skip('deposit eth', async () => {
		const depositTx = await sdk.vaults.depositEth(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			100,
			BigInt(parseEther('0.0000001').toString()),
		);

		console.log('depositTx', depositTx.data);
	});

	it.skip('deposit eth', async () => {
		const depositTx = await sdk.vaults.deposit(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			100,
			BigInt(parseEther('0.0001').toString()),
		);

		const receipt = await depositTx.wait();

		console.log('redeem', (await receipt).status);
	});

	it.skip('balance of', async () => {
		const balance = await sdk.vaults.balanceOf(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			100,
			'0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7',
		);

		console.log('balance', balance.toString());
	});

	it('redeem', async () => {
		const balance = await sdk.vaults.balanceOf(
			'0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992',
			100,
			'0x2bEeEc3887bb8EB97B0FFd1E11F26C4eF625e7B7',
		);

		const redeem = await sdk.vaults.redeem('0x98feddfdf4cb0b1813a7969fdbac5aecda8c6992', 100, balance.toBigInt());

		const receipt = await redeem.wait();

		console.log('redeem', (await receipt).status);
	});
});
