abstract class ApiWrapperService {
	private apiUrl: string;

	constructor(API_URL: string) {
		this.apiUrl = API_URL;
	}

	async get<T>(path: string): Promise<T> {
		return fetch(`${this.apiUrl}${path}`).then(r => r.json());
	}
}

export default ApiWrapperService;
