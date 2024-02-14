import { Environment } from '../constants';

export const ENV = process.env.NODE_ENV;
export const DEBUG = ENV === Environment.Development;
export const API_ROOT = `http://localhost:8000`;