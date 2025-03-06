import { SortOrder } from '../../../types';
import {
	UserTransaction,
	UserTransactionSortBy,
	VaultProjectUser,
	VaultProjectUsersSortBy,
} from '../../../types/users';

export type UserTransactionRes = {
	data: UserTransaction[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
};

export type VaultProjectUsersRes = {
	data: VaultProjectUser[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
};
export interface IUsersBackend {
	getUsersTransactions(
		sortBy: UserTransactionSortBy,
		sortOrder: SortOrder,
		page: number,
		pageSize: number,
		vaults?: string[],
		users?: string[],
		projectIds?: string | string[],
	): Promise<UserTransactionRes>;
	getVaultProjectUsers(
		sortBy: VaultProjectUsersSortBy,
		sortOrder: SortOrder,
		page: number,
		pageSize: number,
		vault?: string,
		projectId?: string,
	): Promise<VaultProjectUsersRes>;
}
