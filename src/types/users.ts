type UserTransaction = {
	id: string;
	project: {
		id: number;
		vaultAddress: string;
	};
	createBlocknumber: number;
	timestamp: number;
	userShareBalance: string;
	userAssetBalance: string;
	txHash: string;
	txType: string;
	transactionAssetAmount: string;
	transactionShareAmount: string;
	user: string;
};

export type UserTransactionWithPagination = {
	userTransactions: UserTransaction[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
};

export enum UserTransactionSortBy {
	TIMESTAMP = 'timestamp',
	PROJECTID = 'projectId',
	TYPE = 'type',
}
