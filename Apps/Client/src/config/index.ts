import { Environment } from '../constants';
import TimeDuration from '../models/TimeDuration';
import { TimeUnit } from '../types/TimeTypes';

export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const DEBUG_I18N = false;

export const SERVER_ROOT = DEBUG ? `http://localhost:8000` : ``;
export const API_ROOT = `${SERVER_ROOT}/api/v1`;

// Local storage
export const STORE_VERSION = 1;
export const STORE_LOCAL_STORAGE_KEY = 'persist:root';

// Auth
export const COOKIE_NAME = `quiz`;

// Time
export const REFRESH_STATUS_INTERVAL = 5_000; // (ms)
export const QUIZ_TIMER_URGENT_TIME = new TimeDuration(10, TimeUnit.Second);

// Defaults
export const DEFAULT_QUIZ_NAME = process.env.REACT_APP_DEFAULT_QUIZ_NAME!;
export const DEFAULT_QUIZ_ID = process.env.REACT_APP_DEFAULT_QUIZ_ID!;
export const DEFAULT_TEAM_ID = process.env.REACT_APP_DEFAULT_TEAM_ID!;

// URL
export const URL_PARAM_QUIZ_NAME = 'q';
export const URL_PARAM_QUIZ_ID = 'qid';
export const URL_PARAM_TEAM_ID = 'tid';
export const URL_PARAM_HIDE = [true, 'true'].includes(process.env.REACT_APP_HIDE_URL_QUIZ_PARAMS!);

// Logging
export const LOG_SERVER_CALLS = [true, 'true'].includes(process.env.REACT_APP_LOG_SERVER_CALLS!) ?? DEBUG;
export const LOG_SERVER_ACTIONS = [true, 'true'].includes(process.env.REACT_APP_LOG_SERVER_ACTIONS!) ?? DEBUG;