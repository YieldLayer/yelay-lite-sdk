import ApiWrapperService from '../../services/ApiWrapperService';
import { IUsersBackend, UserTransactionRes, VaultProjectUsersRes } from '../../app/ports/backend/IUsersBackend';
import { UserTransactionSortBy, VaultProjectUsersSortBy } from '../../types/users';
import { SortOrder } from '../../types';

export class UsersBackend extends ApiWrapperService implements IUsersBackend {
	constructor(backendUrl: string) {
		super(backendUrl);
	}

	async getUsersTransactions(
		sortBy: UserTransactionSortBy,
		sortOrder: SortOrder,
		page: number,
		pageSize: number,
		vaults?: string[],
		users?: string[],
		projectIds?: string | string[],
	): Promise<UserTransactionRes> {
		const searchParams = new URLSearchParams();

		searchParams.append('sortBy', sortBy);
		searchParams.append('sortOrder', sortOrder);
		searchParams.append('page', page.toString());
		searchParams.append('pageSize', pageSize.toString());

		if (users) {
			users.forEach(user => searchParams.append('users', user));
		}

		if (vaults) {
			vaults.forEach(user => searchParams.append('vaults', user));
		}

		if (projectIds) {
			if (Array.isArray(projectIds)) {
				projectIds.forEach(id => searchParams.append('projectIds', id));
			} else {
				searchParams.append('projectIds', projectIds);
			}
		}

		const res: { data: UserTransactionRes } = await this.axios.get(
			`/transactions/users?${searchParams.toString()}`,
		);
		return res.data;
	}

	async getVaultProjectUsers(
		sortBy: VaultProjectUsersSortBy,
		sortOrder: SortOrder,
		page: number,
		pageSize: number,
		vault?: string,
		projectId?: string,
	): Promise<VaultProjectUsersRes> {
		const searchParams = new URLSearchParams();

		searchParams.append('sortBy', sortBy);
		searchParams.append('sortOrder', sortOrder);
		searchParams.append('page', page.toString());
		searchParams.append('pageSize', pageSize.toString());

		if (projectId) {
			searchParams.append('projectId', projectId);
		}

		if (vault) {
			searchParams.append('vault', vault);
		}

		const res: { data: VaultProjectUsersRes } = await this.axios.get(`/users?${searchParams.toString()}`);

		return res.data;
	}
}
