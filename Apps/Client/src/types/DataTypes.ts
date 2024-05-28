import { Auth } from '.';
import { QuizName } from '../constants';
import { QuizJSON } from './JSONTypes';
import { TimeUnit } from './TimeTypes';

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
  isAuthenticated: boolean,
};

export type LoginData = Auth & {
  quizName: QuizName,
  quizId: string,
  teamId: string,
};

export type UserData = {
  username: string,
  isAdmin: boolean,
};

export type VersionData = {
  version: string,
};

export type VotesData = number[];

export type PlayerData = {
  username: string,
  teamId?: string,
};

export type PlayersData = PlayerData[];

export type TimerData = {
  isEnabled: boolean,
  startedAt?: Date,
  duration?: {
    amount: number,
    unit: TimeUnit,
  },
};

export type StatusData = {
  isStarted: boolean,
  isOver: boolean,
  isSupervised: boolean,
  questionIndex: number,
  votesCount: number[],
  timer: TimerData,
};

export type ScoresData = Record<string, number>;

export type GroupedScoresData = {
  admins: ScoresData,
  users: ScoresData,
};



export type CallStartQuizRequestData = {
  isSupervised: boolean,
  isTimed: boolean,
};
export type CallVoteRequestData = {
  vote: number,
};



export type CallPingResponseData = PingData;
export type CallLogInResponseData = UserData;

export type CallGetVersionResponseData = VersionData;
export type CallGetQuizNamesResponseData = string[];
export type CallGetQuestionsResponseData = QuizJSON;
export type CallGetUserResponseData = UserData;
export type CallGetStatusResponseData = StatusData;
export type CallGetVotesResponseData = VotesData;
export type CallGetPlayersResponseData = PlayersData;
export type CallGetScoresResponseData = GroupedScoresData;

export type CallVoteResponseData = { status: StatusData, votes: VotesData };