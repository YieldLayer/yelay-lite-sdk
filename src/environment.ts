import { ChainId, SDKConfig } from './types/config';

export const getEnvironment = (chainId: ChainId): SDKConfig => {
	const backendUrl = 'https://lite.api.yelay.io/v2';
	
	if (chainId === 1) {
		return {
			contracts: {
				VaultWrapper: '0xf65d02700915259602D9105b66401513D1CB61ff',
				Swapper: '0xD49Dc240CE448BE0513803AB82B85F8484748871',
				YieldExtractor: '0xD86A5188094E83B83Aba907E0EAfB0222eb677F4',
			},
			backendUrl,
		};
	}
	throw new Error(`Chain ${chainId} is not supported`);
};
