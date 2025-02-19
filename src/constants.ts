import { ContractAddresses, SDKConfig } from './types';

export const contracts: Record<number, ContractAddresses> = {
	8453: {
		VaultWrapper: '0x977E50cc0D9fbEFDac05B4842D1795Dfa4cA1afd',
		YelayLiteVault: '',
		Swapper: '0xf9A42821bC7B13C47A6c934704645111eaD836A9',
		DepositLockPlugin: '',
	},
};

export const sdkConfig: Record<number, SDKConfig> = {
	8453: {
		backendUrl: 'https://lite.dev.yelay.io/',
		contractAddresses: contracts[8453],
		chainId: 8453,
	},
};

export const devSdkConfig: Record<number, SDKConfig> = {
	8453: {
		backendUrl: 'https://lite.dev.yelay.io/',
		contractAddresses: contracts[8453],
		chainId: 8453,
	},
};
