import { name, version, label } from '../../package.json';
import { Environment } from '../types';

export const ENVIRONMENTS = Object.values(Environment);

export const PACKAGE_NAME = name;
export const PACKAGE_VERSION = version;

export const APP_NAME = label;

export const EPOCH_TIME_INIT = new Date(0);

export const NEW_LINE_REGEXP = /[\r\n]+/;
export const NEW_LINE = '\n';