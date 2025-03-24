import { EventsRange } from './backend';

export type VaultYield = EventsRange & {
	vault: string;
	yield: string;
	apy: string;
};

export type YieldAggregated = EventsRange & {
	vault: string;
	user: string;
	pools: {
		[id: number]: string;
	};
};
