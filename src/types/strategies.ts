export type ProtocolData = {
	id: string;
	name: string;
	prefixes: string[];
	description: string;
	category: string;
	auditor: string;
	compoundedRewards: boolean;
	withdrawalFees: boolean;
	logoUrl: string;
};

export type StrategyVaultData = {
	address?: string;
	chainId: number;
	name: string;
	yelayLiteVault: string;
	apy?: {
		base?: {
			'1day'?: number;
			'7day'?: number;
			'30day'?: number;
		};
		rewards?: {
			'1day'?: number;
			'7day'?: number;
			'30day'?: number;
		};
		total?: {
			'1day'?: number;
			'7day'?: number;
			'30day'?: number;
		};
	};
	tvlDetails?: {
		tvlNative?: string;
		tvlUsd?: string;
		lockedNative?: string;
		lockedUsd?: string;
		liquidNative?: string;
		liquidUsd?: string;
	};
};

export type Protocol = Omit<ProtocolData, 'prefixes'>;

export type Strategy = {
	name: string;
	protocolId: string;
	allocation: number;
	address?: string;
	chainId: number;
	yelayLiteVault: string;
	apy?: {
		base?: {
			'1day'?: number;
			'7day'?: number;
			'30day'?: number;
		};
		rewards?: {
			'1day'?: number;
			'7day'?: number;
			'30day'?: number;
		};
		total?: {
			'1day'?: number;
			'7day'?: number;
			'30day'?: number;
		};
	};
	tvlDetails?: {
		tvlNative?: string;
		tvlUsd?: string;
		lockedNative?: string;
		lockedUsd?: string;
		liquidNative?: string;
		liquidUsd?: string;
	};
};
