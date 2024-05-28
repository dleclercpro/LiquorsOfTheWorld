import { RedisClientType, createClient } from 'redis';
import logger from '../../../logger';
import { Auth, DatabaseOptions, IKeyValueDatabase, TimeUnit } from '../../../types';
import TimeDuration from '../../units/TimeDuration';
import { REDIS_RETRY_CONN_MAX_ATTEMPTS, REDIS_RETRY_CONN_MAX_BACKOFF } from '../../../config';

class RedisDatabase implements IKeyValueDatabase<string> {
    private host: string;
    private port: number;
    private name: string;
    private auth?: Auth;

    private index: number; // Database index
    private client: RedisClientType;
    
    public constructor(options: DatabaseOptions, index: number = 0) {
        const { host, port, name, auth } = options;

        this.host = host;
        this.port = port;
        this.name = name;
        this.auth = auth;

        if (index < 0 || index > 15) {
            throw new Error('INVALID_REDIS_DATABASE_INDEX');
        }
        this.index = index;

        this.client = createClient({
            url: this.getURI(),
            database: index,
            socket: {
                reconnectStrategy: this.connect,
            },
        });
    }

    private getURI = () => {
        let uri = this.getAnonymousURI();

        if (this.auth) {
            const { username, password } = this.auth;

            uri = uri.replace('[USER]', encodeURIComponent(username));
            uri = uri.replace('[PASS]', encodeURIComponent(password));
        }

        return uri;
    }

    private getAnonymousURI = () => {
        const uri = `${this.host}:${this.port}`;

        if (this.auth) {
            return `redis://[USER]:[PASS]@${uri}`;
        }

        return `redis://${uri}`;
    }

    public async start() {
        logger.debug(`Using Redis database '${this.index}'.`);

        this.listen();

        logger.debug(`Trying to connect to: ${this.getAnonymousURI()}`);

        await this.client.connect();
    }

    public async stop() {
        await this.client.quit();
    }

    private listen = () => {
        this.client.on('ready', () => {
            logger.trace('Ready.');
        });

        this.client.on('connect', () => {
            logger.trace('Connected.');
        });

        this.client.on('reconnecting', () => {
            logger.trace('Reconnecting...');
        });

        this.client.on('end', () => {
            logger.trace('Disconnected.');
        });

        this.client.on('warning', (warning: any) => {
            logger.trace(`Warning: ${warning}`);
        });

        this.client.on('error', (error: any) => {
            logger.trace(`Error: ${error.message}`);

            // Log whenever a database connection is refused
            if (error && error.code === 'ECONNREFUSED') {
                logger.error('Redis refused connection. Is it running?');
            }
        });
    }

    private connect = (attempts: number, error: any) => {
        if (attempts >= REDIS_RETRY_CONN_MAX_ATTEMPTS) {
            logger.fatal('No more connection attempts allowed: exiting...')
            process.exit(1);
        }

        // First connection attempt: do not wait
        if (attempts === 0) {
            return 0;
        }

        // Reconnect after backing off
        const wait = this.getConnectionBackoff(attempts);
        logger.debug(`Connection attempts left: ${REDIS_RETRY_CONN_MAX_ATTEMPTS - attempts}`);
        logger.debug(`Retrying connection in: ${wait.format()}`);

        return wait.toMs().getAmount();
    }

    private getConnectionBackoff(attempts: number) {
        const maxBackoff = REDIS_RETRY_CONN_MAX_BACKOFF;
        const exponentialBackoff = new TimeDuration(Math.pow(2, attempts), TimeUnit.Second);

        // Backoff exponentially
        if (exponentialBackoff.smallerThan(maxBackoff)) {
            return exponentialBackoff;
        }
        return maxBackoff;
    }

    public async has(key: string) {
        return await this.get(key) !== null;
    }

    public async get(key: string) {
        return await this.client.get(key);
    }

    public async set(key: string, value: string) {
        await this.client.set(key, value);
    }

    public async delete(key: string) {
        const prevValue = await this.client.get(key);

        if (prevValue) {
            await this.client.del(key);
        }
    }

    public async getAllKeys() {
        return await this.client.keys('*');
    }

    public async getAllValues() {
        const keys = await this.getAllKeys();
        const values = await Promise.all(keys.map((key) => this.client.get(key)));

        return values as string[];
    }

    public async getKeysByPattern(pattern: string) {
        return this.client.keys(pattern);
    }

    public async flush() {
        logger.debug(`Flushing Redis database '${this.index}'.`);
        await this.client.flushDb();
    }
}

export default RedisDatabase;