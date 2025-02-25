import { SortOrder } from '../../../types';
import { UserTransaction, UserTransactionSortBy } from '../../../types/users';

export type UserTransactionRes = {
	data: UserTransaction[];
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
		users?: string[],
		projectIds?: string | string[],
	): Promise<UserTransactionRes>;
}
