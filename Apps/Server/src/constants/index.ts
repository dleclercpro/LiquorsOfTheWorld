import { name, version, label } from '../../package.json';
import { Environment } from '../types';
import questionsEN from '../../data/en/questions.json';
import questionsDE from '../../data/de/questions.json';

export const ENVIRONMENTS = Object.values(Environment);

export const QUESTIONS_EN = questionsEN;
export const QUESTIONS_DE = questionsDE;
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