import { EventsRange } from './backend';

export type VaultYield = EventsRange & {
	vault: string;
	yield: string;
	apy: string;
};

export type ProjectYield = EventsRange & {
	data: {
		projectId: number;
		yield: string;
	}[];
};

export type UserYield = EventsRange & {
	data: { user: string; yield: string }[];
};

export type UserYieldAggregatedData = EventsRange & {
	vault: string;
	projects: {
		[id: number]: string;
	};
};

export type YieldAggregated = EventsRange & {
	vault: string;
	user: string;
	projects: {
		[id: number]: string;
	};
};
