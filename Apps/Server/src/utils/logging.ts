import pino, { Level, TransportTargetOptions } from 'pino';
import pretty from 'pino-pretty';
import { Environment } from '../types';

const getConsoleTransport = (level: Level): TransportTargetOptions => ({
    level,
    target: 'pino-pretty',
    options: {
        colorize: true,
        ignore: 'pid,hostname,version',
    },
});

export const getLoggerByEnvironment = (env: Environment, level: Level) => {
    switch (env) {
        case Environment.Test:
            return pino(pretty({ sync: true }));
        default:
            return pino({
                level,
                timestamp: pino.stdTimeFunctions.isoTime,
                transport: getConsoleTransport(level),
            });
    }
}