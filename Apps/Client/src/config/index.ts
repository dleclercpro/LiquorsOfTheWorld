import { Environment, QuizName } from '../constants';

export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const QUIZ_NAME = process.env.REACT_APP_QUIZ as QuizName;

export const SERVER_ROOT = DEBUG ? `http://localhost:8000` : ``;
export const API_ROOT = `${SERVER_ROOT}/api/v1`;

export const REFRESH_STATUS_INTERVAL = 5_000; // (ms)

export const BACKGROUND_URLS = (process.env.REACT_APP_BG_IMAGES as string)
.split(',')
.map(filename => `${SERVER_ROOT}/static/img/bg/${QUIZ_NAME}/${filename}`);