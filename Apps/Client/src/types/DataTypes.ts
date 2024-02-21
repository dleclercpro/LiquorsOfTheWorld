import { Auth } from '.';

export type FetchedData<Data> = {
  data: Data | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

export type PingData = {
  quizId: string,
};

export type LoginData = Auth & {
  quizId: string,
};

export type UserData = {
  username: string,
};

export type VotesData = {
  questionIndex: number,
  votes: number[],
};

export type QuestionIndexData = {
  questionIndex: number,
};

export type ScoresData = Record<string, number>;