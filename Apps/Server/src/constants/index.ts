import { name, version, label } from '../../package.json';
import { Environment } from '../types';
import liquorsQuestionsEN from '../../data/en/liquors/quiz.json';
import liquorsQuestionsDE from '../../data/de/liquors/quiz.json';
import konnyUndJohannesQuestionsEN from '../../data/en/k-und-j/quiz.json';
import konnyUndJohannesQuestionsDE from '../../data/de/k-und-j/quiz.json';
import { QUIZ } from '../config';

export const ENVIRONMENTS = Object.values(Environment);

export enum Language {
  EN = 'en',
  DE = 'de',
}

export enum QuizName {
  Liquors = 'liquors',
  KonnyUndJohannes = 'k-und-j',
}

export const LANGUAGES = Object.values(Language);

export const QUESTIONS_EN = QUIZ === QuizName.KonnyUndJohannes ? konnyUndJohannesQuestionsEN : liquorsQuestionsEN;
export const QUESTIONS_DE = QUIZ === QuizName.KonnyUndJohannes ? konnyUndJohannesQuestionsDE : liquorsQuestionsDE;

export const ANSWERS_EN = QUESTIONS_EN.map(({ answer }) => answer);
export const ANSWERS_DE = QUESTIONS_DE.map(({ answer }) => answer);
export const N_QUESTIONS = QUESTIONS_EN.length;

export const PACKAGE_NAME = name;
export const PACKAGE_VERSION = version;

export const APP_NAME = label;

export const EPOCH_TIME_INIT = new Date(0);

export const SEPARATOR = '|';
export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';