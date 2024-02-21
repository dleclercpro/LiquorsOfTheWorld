import { Environment } from '../constants';

export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const API_ROOT = DEBUG ? `http://localhost:8000/api/v1` : `/api/v1`;
export const REFRESH_STATUS_INTERVAL = 5_000; // (ms)