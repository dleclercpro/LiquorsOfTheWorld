import { Environment } from '../constants';

export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const SERVER_ROOT = DEBUG ? `http://localhost:8000` : ``;
export const API_ROOT = `${SERVER_ROOT}/api/v1`;
export const REFRESH_STATUS_INTERVAL = 5_000; // (ms)

export const BACKGROUND_URLS = [
  `${SERVER_ROOT}/static/img/background-1.jpg`,
  `${SERVER_ROOT}/static/img/background-2.jpg`,
  `${SERVER_ROOT}/static/img/background-3.jpg`,
  `${SERVER_ROOT}/static/img/background-4.webp`,
];