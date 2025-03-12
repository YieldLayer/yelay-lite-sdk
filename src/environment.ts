import { Environment, SDKConfig } from './types/config';

export const getEnvironment = (environment: Environment): SDKConfig => {
	if (environment === 'base-testing') {
		return {
			contracts: {
				VaultWrapper: '0xE252b5c05a18140F15E1941dD2Df8a95bDa8A20b',
				Swapper: '0x769F5bc628CF538E1D64F2e8ED235A8831312249',
			},
			backendUrl: 'https://lite.dev.yelay.io/v2',
			chainId: 8453,
		};
	} else if (environment === 'base') {
		return {
			contracts: {
				VaultWrapper: '0xdccf337ea77b687a4daca5586351b08f8927c825',
				Swapper: '0xbbc6e62f23f714405d7e0b4d3dde079e22748a58',
			},
			backendUrl: 'https://lite.api.yelay.io/v2',
			chainId: 8453,
		};
	}
	throw new Error('Environment not supported');
};
