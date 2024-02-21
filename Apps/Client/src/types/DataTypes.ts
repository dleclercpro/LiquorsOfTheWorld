import { Auth } from '.';

export type FetchedData<Data> = {
  data: Data | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

export type PingData = {
  quizId: string,
  isAdmin: boolean,
};

export type LoginData = Auth & {
  quizId: string,
};

export type UserData = {
  username: string,
  isAdmin: boolean,
};

export type VotesData = {
  status: StatusData,
  votes: number[],
};

export type StatusData = {
  questionIndex: number,
  hasStarted: boolean,
  isOver: boolean,
};

export type ScoresData = Record<string, number>;