import { API_ROOT } from '../../config';
import { ServerResponse } from '../../types/CallTypes';

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

    constructor(url: string, method: string, timeout?: number) {
        this.name = this.constructor.name;
        this.url = `${API_ROOT}${url}`;
        this.method = method;
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

    async execute(payload?: RequestData) {
        console.trace(`Executing API call '${this.name}': ${this.url}`);

        // Store call's payload
        this.payload = payload;

        // Set API call parameters
        this.prepare();

        // Execute call
        const response = await fetch(this.url, this.params)
            .then(async (r) => {
                const res = { status: r.status, statusText: r.statusText };
                console.log(r);

                // Try to parse JSON and return it with rest of
                // response
                try {
                    return { ...res, json: await r.json() as ServerResponse<ResponseData> };
                } catch {
                    return { ...res, json: null };
                }
            });

        console.log(response);

        // There was valid JSON data in the response
        if (response.json) {
            const { code, error, data } = response.json;

            // There was an error
            if (response.status >= 400 && error) {
                return Promise.reject(new Error(error));
            }

            // Everything went fine
            if (response.status < 400 && Number.isInteger(code) && code >= 0) {
                return { code, data };
            }
        }

        // There were other issues
        const err = `Unexpected Error [${response.statusText}]`;
        console.warn(`Error in call '${this.name}': ${err} [${response.status}]`);

        // Something went wrong, but we let the processing happen further down the line
        return Promise.reject(new Error(err));
    }
}

export default Call;