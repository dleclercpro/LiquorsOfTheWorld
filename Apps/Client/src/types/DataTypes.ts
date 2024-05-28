import { Auth } from '.';
import { QuizName } from '../constants';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from './TimeTypes';

export type FetchedData<Data> = {
  data: Data | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

export type PingData = {
  quizId: string | null,
  quizName: string | null,
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

export type TimerData = {
  isEnabled: boolean,
  startedAt?: string,
  duration?: {
    amount: number,
    unit: TimeUnit,
  },
};

export type StatusData = {
  questionIndex: number,
  isStarted: boolean,
  isOver: boolean,
  isSupervised: boolean,
  players: string[],
  votesCount: number[],
  timer: TimerData,
};

export type ScoreData = Record<string, number>;

export type GroupedScoreData = {
  admins: ScoreData,
  users: ScoreData,
};