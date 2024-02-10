import { name, version, label } from '../../package.json';
import { Environment } from '../types';
import quiz from '../../data/quiz.json';

export const ENVIRONMENTS = Object.values(Environment);
export const QUIZ = quiz;
export const ANSWERS = QUIZ.map(({ answer }) => answer);

export const PACKAGE_NAME = name;
export const PACKAGE_VERSION = version;

export const APP_NAME = label;

export const EPOCH_TIME_INIT = new Date(0);

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';