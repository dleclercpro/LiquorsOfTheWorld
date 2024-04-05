import { Environment } from '../constants';

export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const DEBUG_I18N = false;

export const SERVER_ROOT = DEBUG ? `http://localhost:8000` : ``;
export const API_ROOT = `${SERVER_ROOT}/api/v1`;

export const COOKIE_NAME = `quiz`;

export const REFRESH_STATUS_INTERVAL = 5_000; // (ms)

export const STORE_VERSION = 1;