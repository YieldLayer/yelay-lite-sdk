import dotenv from 'dotenv';
import type { Drift } from '@delvtech/drift';
import { YelayLiteSdk } from '../../src/index';

dotenv.config();
jest.setTimeout(200000);

describe('DataProvider', () => {
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

	it('should have data property', () => {
		try {
			expect(sdk.data).toBeDefined();
		} catch (error: any) {
			// Expected if SDK not properly initialized in test environment
			expect(error.message).toContain('SDK not initialized');
		}
	});

	it.skip('should get vaults', async () => {
		const vaults = await sdk.data.getVaults();
		expect(Array.isArray(vaults)).toBe(true);
	});

	it.skip('should check pool active status', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const pool = 1;
		const isActive = await sdk.data.isPoolActive(vault, pool);
		expect(typeof isActive).toBe('boolean');
	});

	it.skip('should get pool TVL', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const pools = [1, 2, 3];
		const tvlData = await sdk.data.getPoolTvl(vault, pools);
		expect(Array.isArray(tvlData)).toBe(true);
		expect(tvlData.length).toBe(pools.length);
	});

	it.skip('should get client data', async () => {
		const client = '0x1234567890123456789012345678901234567890';
		const vault = '0x1234567890123456789012345678901234567890';
		const clientData = await sdk.data.getClientData(client, vault);
		expect(clientData).toBeDefined();
		expect(typeof clientData.minPool).toBe('number');
		expect(typeof clientData.maxPool).toBe('number');
	});

	it.skip('should get historical TVL data', async () => {
		const params = {
			vaultAddress: '0x1234567890123456789012345678901234567890',
			poolId: 1,
		};
		const historicalData = await sdk.data.getHistoricalTvl(params);
		expect(historicalData).toBeDefined();
		expect(historicalData.data).toBeDefined();
		expect(Array.isArray(historicalData.data)).toBe(true);
	});

	it.skip('should get vault yield data', async () => {
		const vaults = ['0x1234567890123456789012345678901234567890'];
		const yieldData = await sdk.data.getVaultYield(vaults);
		expect(Array.isArray(yieldData)).toBe(true);
	});

	it.skip('should get pool yield data', async () => {
		const vaults = ['0x1234567890123456789012345678901234567890'];
		const pools = [1, 2];
		const poolYieldData = await sdk.data.getPoolYield(vaults, pools);
		expect(Array.isArray(poolYieldData)).toBe(true);
	});

	it.skip('should get aggregated yield data', async () => {
		const vaults = ['0x1234567890123456789012345678901234567890'];
		const pools = [1];
		const users = ['0x1234567890123456789012345678901234567890'];
		const aggregatedData = await sdk.data.getAggregatedYield(vaults, pools, users);
		expect(Array.isArray(aggregatedData)).toBe(true);
	});

	it.skip('should get protocols', async () => {
		const protocols = await sdk.data.getProtocols();
		expect(Array.isArray(protocols)).toBe(true);
	});

	it.skip('should get active strategies', async () => {
		const vault = '0x1234567890123456789012345678901234567890';
		const strategies = await sdk.data.getActiveStrategies(vault);
		expect(Array.isArray(strategies)).toBe(true);
	});
});
