import { ethers } from 'ethers';
import { sdkConfig, YelayLiteSdk } from '../../src';
import { parseEther, parseUnits } from 'ethers/lib/utils';

jest.setTimeout(10000);

describe('Vaults', () => {
	let sdk: YelayLiteSdk;

	beforeAll(() => {
		const provider = new ethers.providers.JsonRpcProvider('https://base.llamarpc.com');

		const privateKey = process.env.PRIVATE_KEY ?? '';

		const signer = new ethers.Wallet(privateKey, provider);

		sdk = new YelayLiteSdk(signer, sdkConfig[8453]);
	});

	it('getVaults', async () => {
		const vaults = await sdk.vaults.getVaults(8453);

		console.log('vaults', vaults);
	});

	it.skip('get allowance', async () => {
		const allowance = await sdk.vaults.allowance(
			'c7e3e7bdb15013f74979f81884849eec73bb449596e3201cd7b1c6997af5ba68',
		);

		console.log('allowance', allowance.toString());
	});

	it.skip('approve', async () => {
		const approve = await sdk.vaults.approve(
			'c7e3e7bdb15013f74979f81884849eec73bb449596e3201cd7b1c6997af5ba68',
			BigInt(parseEther('1').toString()),
		);

		console.log('approve', approve);
	});

	it('approve', async () => {
		const approve = await sdk.vaults.approve(
			'c7e3e7bdb15013f74979f81884849eec73bb449596e3201cd7b1c6997af5ba68',
			BigInt(parseEther('1').toString()),
		);

		console.log('approve', approve);
	});
});
