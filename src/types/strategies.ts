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

export type Protocol = Omit<ProtocolData, 'prefixes'>;

export type Strategy = {
	name: string;
	protocolId: string;
	allocation: number;
};
