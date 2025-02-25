import { UsersBackend } from '../../adapters/backend/UsersBackend';
import { SortOrder } from '../../types';
import { UserTransaction, UserTransactionSortBy, UserTransactionWithPagination } from '../../types/users';
import { IUsersBackend } from '../ports/backend/IUsersBackend';

export class Users {
	private usersBackend: IUsersBackend;

	constructor(backendUrl: string) {
		this.usersBackend = new UsersBackend(backendUrl);
	}

	/**
	 * Retrieves users transactions
	 * @param {UserTransactionSortBy} sortBy - Sorting field, by timestamp, projectId, type.
	 * @param {SortOrder} sortOrder - Sort order, either by ASC or DESC.
	 * @param {number} page - Page, for pagination purposes.
	 * @param {number} pageSize - Page size, for pagination purposes.
	 * @param {string[]} users - Array of user address(es).
	 * @param {string[]} projectIds - Array of projectIds.
	 * @returns {Promise<ethers.BigNumber[]>} A promise that resolves to an array of TVL values for each project.
	 */
	async getUsersTransactions(
		sortBy: UserTransactionSortBy,
		sortOrder: SortOrder,
		page: number,
		pageSize: number,
		users?: string[],
		projectIds?: string | string[],
	): Promise<UserTransactionWithPagination> {
		const { data, ...rest } = await this.usersBackend.getUsersTransactions(
			sortBy,
			sortOrder,
			page,
			pageSize,
			users?.map(user => user.toLowerCase()),
			projectIds,
		);

		return { ...rest, userTransactions: data };
	}
}
