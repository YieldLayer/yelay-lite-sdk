export type UserTransaction = {
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

export type VaultProjectUser = {
	user: string;
	deposit_count: number;
	withdraw_count: number;
	total_deposited: number;
	total_withdrawn: number;
	userShareBalance: number;
	latest_tx_timestamp: number;
};

export type VaultProjectUserWithPagination = {
	vaultProjectUsers: VaultProjectUser[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
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

export enum VaultProjectUsersSortBy {
	USER = 'user',
	DEPOSIT_COUNT = 'deposit_count',
	WITHDRAW_COUNT = 'withdraw_count',
	TOTAL_DEPOSITED = 'total_deposited',
	TOTAL_WITHDRAWN = 'total_withdrawn',
	LATEST_TX_TIMESTAMP = 'latest_tx_timestamp',
	USER_SHARE_BALANCE = 'userShareBalance',
}
