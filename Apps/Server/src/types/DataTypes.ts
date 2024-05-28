import { Auth } from '.';
import { QuizName } from '../constants';
import TimeDuration from '../models/units/TimeDuration';
import { QuizStatus } from './QuizTypes';

export type FetchedData<Data> = {
  data: Data | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

export type PingData = {
  quizId: string,
  quizName: QuizName,
  username: string,
  isAdmin: boolean,
};

export type LoginData = Auth & {
  quizId: string,
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

export type PlayerData = {
  username: string,
  teamId?: string,
};

export type StatusData = QuizStatus & {
  players: PlayerData[],
  votesCount: number[],
};

export type ScoreData = Record<string, number>;

export type GroupedScoreData = {
  admins: ScoreData,
  users: ScoreData,
};