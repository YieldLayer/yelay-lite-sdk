import { ChainId, SDKConfig } from './types/config.js';

export const getEnvironment = (chainId: ChainId, testing: boolean): SDKConfig => {
	if (chainId !== 8453 && testing) {
		throw new Error('Test environment is only supported for Base');
	}
	const backendUrl = 'https://lite.api.yelay.io/v2';
	if (chainId === 8453) {
		if (testing) {
			return {
				contracts: {
					VaultWrapper: '0xE252b5c05a18140F15E1941dD2Df8a95bDa8A20b',
					Swapper: '0x769F5bc628CF538E1D64F2e8ED235A8831312249',
					YieldExtractor: '0xf3b5e160898cfd8b89476e77887050abb377c277',
				},
				backendUrl: 'https://lite.dev.yelay.io/v2',
			};
		} else {
			return {
				contracts: {
					VaultWrapper: '0xdccf337ea77b687a4daca5586351b08f8927c825',
					Swapper: '0xbbc6e62f23f714405d7e0b4d3dde079e22748a58',
					YieldExtractor: '0x4d6a89dc55d8bacc0cbc3824bd7e44fa051c3958',
				},
				backendUrl,
			};
		}
	}
	if (chainId === 1) {
		return {
			contracts: {
				VaultWrapper: '0xf65d02700915259602D9105b66401513D1CB61ff',
				Swapper: '0xD49Dc240CE448BE0513803AB82B85F8484748871',
				YieldExtractor: '0x226239384EB7d78Cdf279BA6Fb458E2A4945E275',
			},
			backendUrl,
		};
	}
	if (chainId === 146) {
		return {
			contracts: {
				VaultWrapper: '0x0872e8391662D4e53D6649c8dE5d4bF581Bd778C',
				Swapper: '0x98732e2FEb854bAd400D4b5336f4439E7E53fe88',
				YieldExtractor: '0xB84B621D3da3E5e47A1927883C685455Ad731D7C',
			},
			backendUrl,
		};
	}
	if (chainId === 42161) {
		return {
			contracts: {
				VaultWrapper: '0xAfC182fcFbdA42F639CCD4518aEcccE5Ea777440',
				Swapper: '0x47f9f04DB109D25aEBA42b0d45E6f0Aee852B916',
				YieldExtractor: '0x79b7e90F1BAe837362DBD2c83Bd0715c2De5E47f',
			},
			backendUrl,
		};
	}
	if (chainId === 43114) {
		return {
			contracts: {
				VaultWrapper: '0x20E65eA03a1563Eb95bC7AC25F892D11D7a5D88f',
				Swapper: '0x79b7e90F1BAe837362DBD2c83Bd0715c2De5E47f',
				YieldExtractor: '0x98732e2FEb854bAd400D4b5336f4439E7E53fe88',
			},
			backendUrl,
		};
	}
	throw new Error(`Chain ${chainId} is not supported`);
};
