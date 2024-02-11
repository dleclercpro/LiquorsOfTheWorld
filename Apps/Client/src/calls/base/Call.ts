import fetchWithTimeout from './Fetch';
import { API_ROOT, ENV } from '../../config';
import { SuccessResponse } from '../../types/CallTypes';
import { Environment } from '../../constants';

/**
 * This is a class that models API calls.
 */
class Call<RequestData = void, ResponseData = void> {
    private name: string;
    private url: string;
    private method: string;
    private timeout: number;
    private payload: RequestData | undefined;
    private headers: HeadersInit;
    private params: RequestInit;

    constructor(name: string, url: string, method: string, payload?: RequestData, timeout?: number) {
        this.name = name;
        this.url = ENV === Environment.Development ? `${API_ROOT}${url}` : url; // Proxy request to API server in development mode
        this.method = method;
        this.payload = payload;
        this.timeout = timeout !== undefined ? timeout : 5_000;
        this.headers = {}
        this.params = {};
    }

    getUrl(): string {
        return this.url;
    }

    getMethod(): string {
        return this.method;
    }

    getPayload(): RequestData | undefined {
        return this.payload;
    }

    getHeaders = () => {
        return this.headers;
    }

    setUrl = (url: string) => {
        this.url = url;
    }

    setMethod = (method: string) => {
        this.method = method;
    }

    setPayload = (payload: RequestData) => {
        this.payload = payload;
    }

    setHeaders = (headers: HeadersInit) => {
        this.headers = headers;
    }

    prepareHeaders() {
        this.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    prepare() {
        this.prepareHeaders();

        this.params = {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(this.payload),
            credentials: 'include',
        };
    }

    async execute() {
        console.trace(`Executing API call '${this.name}': ${this.url}`);

        // Set API call parameters
        this.prepare();

        // Execute API call
        const response = await fetchWithTimeout(this.url, this.params, this.timeout)
            .then(res => res.json())
            .catch(err => err.data);

        // There was an error on the server
        if (response && response.error) {
            return Promise.reject(new Error(response.error));
        }

        // Everything went fine on the server
        if (response && Number.isInteger(response.code) && response.code >= 0) {
            return response as SuccessResponse<ResponseData>;
        }

        // There were other issues
        const err = 'UNKNOWN_ERROR';
        console.warn(`Error in call [${this.name}]: ${err}`);

        // Something went wrong, but we let the processing happen further down the line
        return Promise.reject(new Error(err));
    }
}

export default Call;