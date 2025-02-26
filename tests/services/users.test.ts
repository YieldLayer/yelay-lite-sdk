import { ethers } from 'ethers';
import { sdkConfig, SortOrder, YelayLiteSdk } from '../../src';
import dotenv from 'dotenv';
import { UserTransactionSortBy } from '../../src/types/users';

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

	it('getVaults', async () => {
		const vaults = await sdk.users.getUsersTransactions(
			UserTransactionSortBy.TIMESTAMP,
			SortOrder.DESC,
			1,
			10,
			['0x16db68c86edfdb60ba733563326ed392b319eb2b'],
			['0xba11671927693627002275ddd478ba8fd45ea608'],
			['1', '2', '123'],
		);

		console.log('vaults', vaults);
	});
});
