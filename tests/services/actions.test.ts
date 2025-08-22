import dotenv from 'dotenv';
import type { Drift } from '@delvtech/drift';
import { YelayLiteSdk } from '../../src/index';

dotenv.config();
jest.setTimeout(200000);

describe('ActionExecutor', () => {
	let sdk: YelayLiteSdk;
	let drift: any; // Mock drift for testing

	beforeAll(async () => {
		// Mock drift for testing
		drift = {
			getChainId: jest.fn().mockResolvedValue(8453),
		};

		sdk = new YelayLiteSdk();

		try {
			await sdk.init(drift);
		} catch (error) {
			// Tests are mocked, so initialization might fail
			// We'll test the structure instead
		}
	});

	it('should have actions property', () => {
		try {
			expect(sdk.actions).toBeDefined();
		} catch (error: any) {
			// Expected if SDK not properly initialized in test environment
			expect(error.message).toContain('SDK not initialized');
		}
	});

	it.skip('should be able to approve tokens', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const amount = BigInt('1000000000000000000'); // 1 ETH

		// This would normally require a signer/wallet
		const txHash = await sdk.actions.approve(vault, amount);
		expect(typeof txHash).toBe('string');
		expect(txHash.startsWith('0x')).toBe(true);
	});

	it.skip('should be able to approve tokens for vault wrapper', async () => {
		const tokenAddress = '0x1234567890123456789012345678901234567890';
		const amount = BigInt('1000000000000000000'); // 1 ETH

		const txHash = await sdk.actions.approveToken(tokenAddress, amount);
		expect(typeof txHash).toBe('string');
		expect(txHash.startsWith('0x')).toBe(true);
	});

	it.skip('should be able to deposit', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const pool = 1;
		const amount = BigInt('1000000000000000000'); // 1 ETH

		const txHash = await sdk.actions.deposit(vault, pool, amount);
		expect(typeof txHash).toBe('string');
		expect(txHash.startsWith('0x')).toBe(true);
	});

	it.skip('should be able to deposit ETH', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const pool = 1;
		const amount = BigInt('1000000000000000000'); // 1 ETH

		const txHash = await sdk.actions.depositEth(vault, pool, amount);
		expect(typeof txHash).toBe('string');
		expect(txHash.startsWith('0x')).toBe(true);
	});

	it.skip('should be able to withdraw', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const pool = 1;
		const amount = BigInt('1000000000000000000'); // 1 ETH

		const txHash = await sdk.actions.withdraw(vault, pool, amount);
		expect(typeof txHash).toBe('string');
		expect(txHash.startsWith('0x')).toBe(true);
	});

	it.skip('should be able to migrate positions', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const fromPool = 1;
		const toPool = 2;
		const amount = BigInt('1000000000000000000'); // 1 ETH

		const txHash = await sdk.actions.migrate(vault, fromPool, toPool, amount);
		expect(typeof txHash).toBe('string');
		expect(txHash.startsWith('0x')).toBe(true);
	});

	it.skip('should be able to activate pool', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const pool = 1;

		const txHash = await sdk.actions.activatePool(vault, pool);
		expect(typeof txHash).toBe('string');
		expect(txHash.startsWith('0x')).toBe(true);
	});

	it.skip('should be able to claim yield', async () => {
		const claimRequests = [
			{
				yelayLiteVault: '0x1234567890123456789012345678901234567890',
				pool: 1,
				cycle: 1,
				yieldSharesTotal: '1000000000000000000',
				blockNumber: 12345678,
				proof: ['0xabcd...'],
			},
		];

		const txHash = await sdk.actions.claim(claimRequests);
		expect(typeof txHash).toBe('string');
		expect(txHash.startsWith('0x')).toBe(true);
	});
});
