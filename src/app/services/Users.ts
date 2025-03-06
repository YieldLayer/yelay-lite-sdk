import { UsersBackend } from '../../adapters/backend/UsersBackend';
import { SortOrder } from '../../types';
import {
	UserTransactionSortBy,
	UserTransactionWithPagination,
	VaultProjectUsersSortBy,
	VaultProjectUserWithPagination,
} from '../../types/users';
import { IUsersBackend, VaultProjectUsersRes } from '../ports/backend/IUsersBackend';

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
	 * @param {string[]} users - Array of vault addresses.
	 * @param {string[]} users - Array of user address(es).
	 * @param {string[]} projectIds - Array of projectIds.
	 * @returns {Promise<UserTransactionWithPagination>} A promise that resolves to User Transactions together with pagination data
	 */
	async getUsersTransactions(
		sortBy: UserTransactionSortBy,
		sortOrder: SortOrder,
		page: number,
		pageSize: number,
		vaults?: string[],
		users?: string[],
		projectIds?: string | string[],
	): Promise<UserTransactionWithPagination> {
		const { data, ...rest } = await this.usersBackend.getUsersTransactions(
			sortBy,
			sortOrder,
			page,
			pageSize,
			vaults?.map(vault => vault.toLowerCase()),
			users?.map(user => user.toLowerCase()),
			projectIds,
		);

		return { ...rest, userTransactions: data };
	}

	/**
	 * Retrieves vault project users
	 * @param {VaultProjectUsersSortBy} sortBy - Sorting field, by timestamp, projectId, type.
	 * @param {SortOrder} sortOrder - Sort order, either by ASC or DESC.
	 * @param {number} page - Page, for pagination purposes.
	 * @param {number} pageSize - Page size, for pagination purposes.
	 * @param {string} vault - Vault address.
	 * @param {string} projectId - Project ID of Vault.
	 * @returns {Promise<VaultProjectUserWithPagination>} A promise that resolves to Vault Project Users together with pagination data.
	 */
	async getVaultProjectUsers(
		sortBy: VaultProjectUsersSortBy,
		sortOrder: SortOrder,
		page: number,
		pageSize: number,
		vault?: string,
		projectId?: string,
	): Promise<VaultProjectUserWithPagination> {
		const { data, ...rest } = await this.usersBackend.getVaultProjectUsers(
			sortBy,
			sortOrder,
			page,
			pageSize,
			vault,
			projectId,
		);

		return { ...rest, vaultProjectUsers: data };
	}
}
