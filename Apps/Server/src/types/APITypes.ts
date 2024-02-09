import { HttpStatusCode } from './HTTPTypes';

export type CallMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export type CallResponse<Data = void> = {
    code: HttpStatusCode,
    data: Data,
};