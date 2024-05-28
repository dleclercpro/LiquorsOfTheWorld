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

// Auth
export const COOKIE_NAME = `quiz`;

// Times
export const REFRESH_STATUS_INTERVAL = 5_000; // (ms)
export const QUIZ_TIMER_URGENT_TIME = new TimeDuration(15, TimeUnit.Second);