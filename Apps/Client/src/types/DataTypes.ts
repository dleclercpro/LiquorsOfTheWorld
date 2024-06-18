import { Auth } from '.';
import { Language, QuizName, UserType } from '../constants';
import { QuizJSON } from './JSONTypes';
import { TimeUnit } from './TimeTypes';

export type FetchedData<Data> = {
  data: Data | null,
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null,
};

export type VersionData = {
  version: string,
};

export type UserData = {
  username: string,
  teamId: string,
  isAdmin: boolean,
  isAuthenticated: boolean,
};

export type QuizData = {
  name: QuizName,
  label: string,
  id: string,
};

export type AnswerData = {
  index: number,
  value: string,
};

export type TimerData = {
  questionIndex: number,
  startedAt: Date,
  expiresAt: Date,
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
  timer?: TimerData,
};

export type PingData = {
  quiz?: QuizData,
  user?: UserData,
};

export type LoginData = Auth & {
  quizName: QuizName,
  quizId: string,
  teamId: string,
};

export type PlayerData = {
  username: string,
  isAdmin: boolean,
  teamId?: string,
};

export type PlayersData = PlayerData[];

export type VotesData = number[];

export type GroupedVotesData = {
  [UserType.Admin]: Record<string, VotesData>,
  [UserType.Regular]: Record<string, VotesData>,
};

export type VoteCountData = number;

export type GroupedVoteCountData = {
  [UserType.Admin]: VoteCountData,
  [UserType.Regular]: VoteCountData,
};

export type ScoreData = {
  right: number,
  wrong: number,
  missed: number,
  unanswered: number,
};

export type ScoresData = Record<string, ScoreData>;

export type GroupedScoresData = {
  [UserType.Admin]: ScoresData,
  [UserType.Regular]: ScoresData,
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
export type CallGetQuizzesResponseData = { name: QuizName, label: string }[];
export type CallGetTeamsResponseData = string[];
export type CallGetVotesResponseData = GroupedVotesData;
export type CallGetQuestionsResponseData = QuizJSON;
export type CallGetUserResponseData = UserData;
export type CallGetStatusResponseData = StatusData;
export type CallGetPlayersResponseData = PlayersData;
export type CallGetScoresResponseData = GroupedScoresData;

export type CallStartQuestionResponseData = number;
export type CallVoteResponseData = { status: StatusData, votes: GroupedVotesData };