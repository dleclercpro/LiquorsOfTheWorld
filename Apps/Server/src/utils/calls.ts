export interface SuccessResponse<Data> {
  code: number,
  data?: Data,
}

export interface ErrorResponse<Data> {
  code: number,
  error: string,
  data?: Data,
}

export const successResponse = <Data> (data?: Data, code: number = 0): SuccessResponse<Data> => ({
  code,
  data,
});

export const errorResponse = <Data> (error: string, data?: Data, code: number = -1): ErrorResponse<Data> => ({
  code,
  error,
  data,
});