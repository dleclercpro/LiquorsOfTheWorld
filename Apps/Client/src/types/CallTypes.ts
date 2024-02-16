export enum CallType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface ServerResponse<Data = void> {
  code: number,
  error?: string,
  data?: Data,
}