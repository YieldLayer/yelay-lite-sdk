import ApiWrapperService from '../../services/ApiWrapperService';
import { IVaultsBackend } from '../../app/ports/backend/IVaultsBackend';
import { Vault } from '../../types/vaults';
import { IUsersBackend, UserTransactionRes } from '../../app/ports/backend/IUsersBackend';
import { UserTransaction, UserTransactionSortBy } from '../../types/users';
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
}
