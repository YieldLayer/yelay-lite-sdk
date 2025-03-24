import { ChainId, SDKConfig } from './types/config';

export const getEnvironment = (chainId: ChainId, testing: boolean): SDKConfig => {
	if (chainId !== 8453 && testing) {
		throw new Error('Test environment is only supported for Base');
	}
	if (chainId === 8453) {
		if (testing) {
			return {
				contracts: {
					VaultWrapper: '0xE252b5c05a18140F15E1941dD2Df8a95bDa8A20b',
					Swapper: '0x769F5bc628CF538E1D64F2e8ED235A8831312249',
				},
				backendUrl: 'https://lite.dev.yelay.io/v2',
			};
		} else {
			return {
				contracts: {
					VaultWrapper: '0xdccf337ea77b687a4daca5586351b08f8927c825',
					Swapper: '0xbbc6e62f23f714405d7e0b4d3dde079e22748a58',
				},
				backendUrl: 'https://lite.api.yelay.io/v2',
			};
		}
	}
	if (chainId === 1) {
		return {
			contracts: {
				VaultWrapper: '0xf65d02700915259602D9105b66401513D1CB61ff',
				Swapper: '0xD49Dc240CE448BE0513803AB82B85F8484748871',
			},
			backendUrl: 'https://lite.api.yelay.io/v2',
		};
	}
	throw new Error(`Chain ${chainId} is not supported`);
};
