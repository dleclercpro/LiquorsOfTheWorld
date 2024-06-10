import TimeDuration from "../models/TimeDuration";
import { TimeUnit } from "../types/TimeTypes";

export enum Environment {
  Production = 'production',
  Development = 'development',
  Test = 'test',
};

export enum Language {
  EN = 'en',
  DE = 'de',
};

export enum PageUrl {
  Home = '/',
  Error = '/error',
  Admin = '/admin',
  Quizzes = '/quizzes',
  Quiz = '/quiz',
  Scores = '/scores',
};

export enum UserType {
  Regular = 'regular',
  Admin = 'admin',
};

export enum QuizName {
  Liquors = 'liquors',
  KonnyUndJohannes = 'k-und-j',
};

export enum QuestionType {
  Text = 'text',
  Image = 'image',
  Video = 'video',
};

export enum AspectRatio {
  Square = '1:1',
  FourByThree = '4:3',
  SixteenByNine = '16:9',
};

export const QUIZ_LABELS = {
  [QuizName.Liquors]: 'Liquors',
  [QuizName.KonnyUndJohannes]: 'Konny & Johannes',
};

export const USER_TYPES = Object.values(UserType);

export const NO_TIME = new TimeDuration(0, TimeUnit.Millisecond);
export const NO_VOTE_INDEX = -1;
export const NO_QUESTION_INDEX = -1;