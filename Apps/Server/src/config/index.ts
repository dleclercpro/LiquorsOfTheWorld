import { Level } from 'pino';
import { loadEnvironment } from '../utils/env';
import { parseNumberText } from '../utils/string';
import TimeDuration from '../models/units/TimeDuration';
import { Environment, TimeUnit } from '../types';
import { PACKAGE_NAME } from '../constants';
import path from 'path';

// Environment
export const ENV = loadEnvironment();
export const PROD = ENV === Environment.Production;
export const LOGGING_LEVEL = (process.env.LOGGING_LEVEL ?? 'trace') as Level;

// API
export const API_VERSION = 1;
export const API_ROOT = `/api/v${API_VERSION}`;

// Server
export const HOST = process.env.HOST!;
export const PORT = parseNumberText(process.env.PORT);
export const ROOT = `http://${HOST}:${PORT}`;

// Client
export const CLIENT_DIR = path.join(__dirname, `../..`, `client`);
export const CLIENT_HOST = process.env.CLIENT_HOST!;
export const CLIENT_PORT = parseNumberText(process.env.CLIENT_PORT);
export const CLIENT_ROOT = `http://${CLIENT_HOST}:${CLIENT_PORT}`;

// Redis
export const REDIS_HOST = process.env.REDIS_HOST!;
export const REDIS_PORT = parseNumberText(process.env.REDIS_PORT);
export const REDIS_NAME = PACKAGE_NAME;
export const REDIS_RETRY_CONNECT_MAX_DELAY = new TimeDuration(3, TimeUnit.Seconds);
export const REDIS_RETRY_CONNECT_TIMEOUT = new TimeDuration(5, TimeUnit.Seconds);
export const REDIS_RETRY_CONNECT_MAX = 5;

// Authentication
export const COOKIE_NAME = `liquors`;
export const TOKEN_SECRET = process.env.TOKEN_SECRET!;
export const N_SALT_ROUNDS = 10;

// Misc
export const N_QUIZ_QUESTIONS = 20;