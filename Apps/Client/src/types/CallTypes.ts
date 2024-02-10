export enum CallType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface SuccessResponse<Data = void> {
  code: number,
  data?: Data,
}

export interface ErrorResponse<Data = void> {
  code: number,
  error: string,
  data?: Data,
}