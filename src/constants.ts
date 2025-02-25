import { ContractAddresses, SDKConfig } from './types';

export const contracts: Record<number, ContractAddresses> = {
	8453: {
		VaultWrapper: '0xE252b5c05a18140F15E1941dD2Df8a95bDa8A20b',
		YelayLiteVault: '',
		Swapper: '0x769F5bc628CF538E1D64F2e8ED235A8831312249',
	},
};

export const testContracts: Record<number, ContractAddresses> = {
	8453: {
		VaultWrapper: '0xE252b5c05a18140F15E1941dD2Df8a95bDa8A20b',
		YelayLiteVault: '',
		Swapper: '0x769F5bc628CF538E1D64F2e8ED235A8831312249',
	},
};

export const sdkConfig: Record<number, SDKConfig> = {
	8453: {
		backendUrl: 'https://lite.dev.yelay.io/base/',
		contractAddresses: contracts[8453],
		chainId: 8453,
	},
};

export const devSdkConfig: Record<number, SDKConfig> = {
	8453: {
		backendUrl: 'https://lite.dev.yelay.io/base/',
		contractAddresses: testContracts[8453],
		chainId: 8453,
	},
};
