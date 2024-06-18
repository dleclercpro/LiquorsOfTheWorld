import { name, version, label } from '../../package.json';
import { Environment } from '../types';

export const ENVIRONMENTS = Object.values(Environment);

export const PACKAGE_NAME = name;
export const PACKAGE_VERSION = version;

export const APP_NAME = label;

export const EPOCH_TIME_INIT = new Date(0);

export const SEPARATOR = '|';
export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';



export enum Language {
  EN = 'en',
  DE = 'de',
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

export const QUIZ_LABELS = {
  [QuizName.Liquors]: 'Liquors',
  [QuizName.KonnyUndJohannes]: 'Konny & Johannes',
};

export const USER_TYPES = Object.values(UserType);

export const QUIZ_NAMES = Object.values(QuizName);
export const LANGUAGES = Object.values(Language);

export const NO_VOTE_INDEX = -1;