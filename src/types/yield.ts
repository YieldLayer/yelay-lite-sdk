import { BigNumber } from 'ethers';
import { EventsRange } from './backend';

export type VaultYield = EventsRange & {
	vault: string;
	yield: string;
	apy: string;
};

export type PoolYield = EventsRange & {
	vault: string;
	pools: {
		[id: number]: string;
	};
};

export type YieldAggregated = EventsRange & {
	vault: string;
	user: string;
	pools: {
		[id: number]: string;
	};
};

export type ClaimRequest = {
	yelayLiteVault: string;
	projectId: number;
	cycle: number;
	yieldSharesTotal: string;
	proof: string[];
};

export type ClaimableYield = {
	claimable: string;
	claimRequest: ClaimRequest;
};
