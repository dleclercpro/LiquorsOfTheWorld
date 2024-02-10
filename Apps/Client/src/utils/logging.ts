import { Environment } from '../constants';

const LOG_LEVELS = {
  [Environment.Production]: ['error'], // Only show errors in production
  [Environment.Development]: ['log', 'warn', 'error'], // Show all logs in development
  [Environment.Test]: ['trace', 'log', 'warn', 'error'], // Show trace logs when testing
};

export const setLogLevel = (environment: Environment) => {
  const levelsToShow = LOG_LEVELS[environment] || [];

  // Override console methods
  if (!levelsToShow.includes('trace')) {
    console.trace = () => {};
  }
  if (!levelsToShow.includes('log')) {
    console.log = () => {};
  }
  if (!levelsToShow.includes('warn')) {
    console.warn = () => {};
  }
  if (!levelsToShow.includes('error')) {
    console.error = () => {};
  }
};