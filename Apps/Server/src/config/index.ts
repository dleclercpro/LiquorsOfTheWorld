import { Level } from 'pino';
import { loadEnvironment } from '../utils/env';
import { parseNumberText } from '../utils/string';

export const ENV = loadEnvironment();
export const PORT = parseNumberText(process.env.PORT);
export const LOGGING_LEVEL = (process.env.LOGGING_LEVEL ?? 'debug') as Level;