export type UserTransaction = {
	txhash: string;
	type: string;
	timestamp: number;
	projectId: number;
	transactionassetamount: string;
	transactionshareammount: string;
	userassetbalance: string;
	usersharebalance: string;
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
