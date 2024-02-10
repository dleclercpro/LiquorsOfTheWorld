export enum CallType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}



// Server responses
export interface ServerResponse<Data = void> {
  code: number,
  error?: string,
  data: Data,
}