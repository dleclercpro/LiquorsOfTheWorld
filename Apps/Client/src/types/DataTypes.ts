import { Auth } from '.';
import { QuizName } from '../constants';

export type FetchedData<Data> = {
  data: Data | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

export type PingData = {
  quizId: string | null,
  username: string | null,
  isAdmin: boolean,
  isAuthenticated: boolean,
};

export type LoginData = Auth & {
  quizId: string,
  quizName: QuizName,
};

export type UserData = {
  username: string,
  isAdmin: boolean,
};

export type VersionData = {
  version: string,
};

export type VotesData = {
  status: StatusData,
  votes: number[],
};

export type StatusData = {
  questionIndex: number,
  isStarted: boolean,
  isOver: boolean,
  isSupervised: boolean,
  players: string[],
  votesCount: number[],
};

export type ScoreData = Record<string, number>;

export type GroupedScoreData = {
  admins: ScoreData,
  users: ScoreData,
};