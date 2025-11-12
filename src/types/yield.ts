import { Address } from '@gud/drift';
import { EventsRange } from './backend.js';
import { Vault } from './vaults.js';

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

export type ClaimRequestRaw = {
	yelayLiteVault: string;
	projectId: number;
	cycle: number;
	yieldSharesTotal: string;
	blockNumber: number;
	proof: string[];
};

export type ClaimRequest = {
	yelayLiteVault: string;
	pool: number;
	cycle: number;
	yieldSharesTotal: string;
	blockNumber: number;
	proof: string[];
};

export type ClaimableYield = {
	claimable: string;
	claimed: string;
	claimRequest: ClaimRequest;
};

export type ClaimRequestParams = {
	user: string;
	poolIds?: number[];
	vaultAddresses?: string[];
};

export type GetLastClaimEventParams = {
	vault: Vault;
	user: Address;
	poolId: number;
};
