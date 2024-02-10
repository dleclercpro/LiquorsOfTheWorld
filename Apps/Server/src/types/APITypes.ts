import { HttpStatusCode } from './HTTPTypes';

export type CallMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';

export type CallResponse<Data = void> = {
    code: HttpStatusCode,
    data: Data,
};

export interface SuccessResponse<Data> {
    code: number,
    data?: Data,
  }
  
  export interface ErrorResponse<Data> {
    code: number,
    error: string,
    data?: Data,
  }