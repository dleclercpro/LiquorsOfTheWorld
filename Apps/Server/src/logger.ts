import { ENV, LOGGING_LEVEL } from './config';
import { getLoggerByEnvironment } from './utils/logging';

export default getLoggerByEnvironment(ENV, LOGGING_LEVEL);