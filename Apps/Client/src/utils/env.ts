import { Environment } from '../constants';

export const ENV = process.env.NODE_ENV as Environment;
console.log(`Environment: ${ENV}`);