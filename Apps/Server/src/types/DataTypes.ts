import { Auth, TimeUnit } from '.';
import { Language, QuizName } from '../constants';
import { QuizJSON } from './JSONTypes';

export type FetchedData<Data> = {
  data: Data | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

export type UserData = {
  username: string | null,
  teamId: string | null,
  isAdmin: boolean,
  isAuthenticated: boolean,
};

export type QuizData = {
  quizName: QuizName,
  quizId: string,
};

export type PingData = UserData & QuizData;

export type LoginData = Auth & QuizData & {
  teamId: string,
};

export type VersionData = {
  version: string,
};

export type VotesData = number[];

export type PlayerData = {
  username: string,
  teamId: string,
};

export type PlayersData = PlayerData[];

export type TimerData = {
  startedAt: Date,
  duration: {
    amount: number,
    unit: TimeUnit,
  },
};

export type StatusData = {
  isStarted: boolean,
  isOver: boolean,
  isSupervised: boolean,
  isNextQuestionForced: boolean,
  questionIndex: number,
  voteCounts: number[],
  timer?: TimerData,
};

export type ScoresData = Record<string, number>;

export type GroupedScoresData = {
  admins: ScoresData,
  users: ScoresData,
};



export type CallStartQuizRequestData = {
  isSupervised: boolean,
  isTimed: boolean,
  isNextQuestionForced: boolean,
  language: Language,
};
export type CallVoteRequestData = {
  vote: number,
};



export type CallPingResponseData = PingData;
export type CallLogInRequestData = LoginData;
export type CallLogInResponseData = UserData;

export type CallGetVersionResponseData = VersionData;
export type CallGetQuizNamesResponseData = string[];
export type CallGetTeamsResponseData = string[];
export type CallGetVotesResponseData = VotesData;
export type CallGetQuestionsResponseData = QuizJSON;
export type CallGetUserResponseData = UserData;
export type CallGetStatusResponseData = StatusData;
export type CallGetPlayersResponseData = PlayersData;
export type CallGetScoresResponseData = GroupedScoresData;

export type CallStartQuestionResponseData = number;
export type CallVoteResponseData = { status: StatusData, votes: VotesData };