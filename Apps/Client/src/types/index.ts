export enum CallType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export type Auth = {
  username: string,
  password: string,
}



// Server responses
export interface ServerResponse<Data = void> {
  code: number,
  error?: string,
  data: Data,
}

export interface SuccessResponse<Data = void> {
  code: number,
  error?: string,
  data: Data,
}

export type QuizQuestionResponse = {
  theme: string,
  answer: number,
  question: string,
  options: string[],
}

export type QuizResponse = QuizQuestionResponse[];