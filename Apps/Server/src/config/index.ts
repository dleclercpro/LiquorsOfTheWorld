import { Level } from 'pino';
import { loadEnvironment } from '../utils/env';
import { parseBooleanText, parseNumberText } from '../utils/string';
import TimeDuration from '../models/units/TimeDuration';
import { Environment, TimeUnit } from '../types';
import path from 'path';

// Environment
export const ENV = loadEnvironment();
export const DEV = ENV === Environment.Development;
export const TEST = ENV === Environment.Test;
export const PROD = ENV === Environment.Production;
export const LOGGING_LEVEL = (process.env.LOGGING_LEVEL ?? 'trace') as Level;

// API
export const API_VERSION = `v1`;

// Server
export const HOST = process.env.HOST!;
export const PORT = parseNumberText(process.env.PORT);
export const ROOT = `http://${HOST}:${PORT}`;
export const PUBLIC_DIR = path.join(__dirname, `../..`, `public`);

// Client
export const CLIENT_DIR = path.join(__dirname, `../..`, `client`);
export const CLIENT_HOST = process.env.CLIENT_HOST!;
export const CLIENT_PORT = parseNumberText(process.env.CLIENT_PORT);
export const CLIENT_ROOT = `http://${CLIENT_HOST}:${CLIENT_PORT}`;

// Redis
export const REDIS_ENABLE = [true, 'true'].includes(process.env.REDIS_ENABLE!);

export const REDIS_RETRY_CONN_TIMEOUT = new TimeDuration(5, TimeUnit.Second);
export const REDIS_RETRY_CONN_MAX_BACKOFF = new TimeDuration(30, TimeUnit.Second);
export const REDIS_RETRY_CONN_MAX_ATTEMPTS = 5;

export const REDIS_DATABASE = parseNumberText(process.env.REDIS_DATABASE);
export const REDIS_HOST = process.env.REDIS_HOST!;
export const REDIS_PORT = parseNumberText(process.env.REDIS_PORT);
export const REDIS_NAME = process.env.REDIS_NAME!;

export const REDIS_OPTIONS = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    name: REDIS_NAME,
};

// Authentication
export const COOKIE_NAME = `quiz`;
export const TOKEN_SECRET = process.env.TOKEN_SECRET!;
export const N_SALT_ROUNDS = 10;

export const ADMINS = process.env.ADMINS!
    .split(',')
    .map(str => str.split(':'))
    .map(([username, password]) => ({ username, password }));

export const USERS = process.env.USERS!
    .split(',')
    .map(str => str.split(':'))
    .map(([username, password]) => ({ username, password }));

// Quiz
export const TIMER_DURATION = new TimeDuration(1, TimeUnit.Minute);
export const TEAMS_ENABLE = parseBooleanText(process.env.TEAMS_ENABLE);
export const TEAMS = process.env.TEAMS!
    .split(',')
    .map(str => str.split(':'))
    .map(([id, name]) => ({ id, name }));