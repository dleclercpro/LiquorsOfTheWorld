import { Logger } from 'pino';
import { Auth } from '../../types';
import logger from '../../logger';

export interface DatabaseOptions {
    host: string,
    port: number,
    name: string,
    auth?: Auth,
}

abstract class Database {
    protected host: string;
    protected port: number;
    protected name: string;
    protected auth?: Auth;

    protected logger: Logger;

    protected abstract getURI(): string;
    protected abstract getAnonymousURI(): string;

    public constructor(options: DatabaseOptions) {
        const { host, port, name, auth } = options;

        this.host = host;
        this.port = port;
        this.name = name;
        this.auth = auth;

        this.logger = logger;
    }
}

export default Database;