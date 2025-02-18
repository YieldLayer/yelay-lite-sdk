import axios, { AxiosInstance } from 'axios';

// this class makes it easy to swap out axios for any other GraphQL request library
abstract class ApiWrapperService {
	public axios: AxiosInstance;

	constructor(API_URL: string) {
		this.axios = axios.create({
			baseURL: API_URL,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export default ApiWrapperService;
