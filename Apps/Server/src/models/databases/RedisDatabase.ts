import { RedisClientType, createClient } from 'redis';
import Database, { DatabaseOptions } from './Database';
import { IKeyValueDatabase } from './MemoryDatabase';
import TimeDuration from '../units/TimeDuration';
import { DB_RETRY_CONNECT_MAX, DB_RETRY_CONNECT_MAX_DELAY } from '../../config';
import { TimeUnit } from '../../types';
import logger from '../../logger';

class RedisDatabase extends Database implements IKeyValueDatabase<string> {
    protected client: RedisClientType;
    
    public constructor(options: DatabaseOptions) {
        super(options);

        const url = this.getURI();

        this.client = createClient({
            url,
            socket: {
                reconnectStrategy: this.retry,
            },
        });
    }

    protected getURI = () => {
        let uri = this.getAnonymousURI();

        if (this.auth) {
            const { username, password } = this.auth;

            uri = uri.replace('[USER]', encodeURIComponent(username));
            uri = uri.replace('[PASS]', encodeURIComponent(password));
        }

        return uri;
    }

    protected getAnonymousURI = () => {
        const uri = `${this.host}:${this.port}`;

        if (this.auth) {
            return `redis://[USER]:[PASS]@${uri}`;
        }

        return `redis://${uri}`;
    }

    public async start() {

        // Listen to events it emits
        this.listen();

        logger.debug(`Trying to connect to: ${this.getAnonymousURI()}`);

        // Connect to database
        await this.client.connect();
    }

    public async stop() {
        await this.client.quit();
    }

    protected listen = () => {
        this.client.on('ready', () => {
            logger.debug('Ready.');
        });

        this.client.on('connect', () => {
            logger.debug('Connected.');
        });

        this.client.on('reconnecting', () => {
            logger.debug('Reconnecting...');
        });

        this.client.on('end', () => {
            logger.debug('Disconnected.');
        });

        this.client.on('warning', (warning: any) => {
            logger.warn(warning.message);
        });

        this.client.on('error', (error: any) => {
            logger.error(error.message);
        });
    }

    protected retry = (retries: number, error: any) => {

        // End reconnecting on a specific error and flush all commands with
        // a individual error
        if (error && error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection.');
        }
        
        // End reconnecting with built in error
        if (retries > DB_RETRY_CONNECT_MAX) {
            return new Error('Number of connection retries exhausted. Stopping connection attempts.');
        }

        // Reconnect after ... ms
        const wait = Math.min(new TimeDuration(retries + 0.5, TimeUnit.Seconds).toMs().getAmount(), DB_RETRY_CONNECT_MAX_DELAY.toMs().getAmount());
        logger.debug(`Waiting ${wait} ms...`);

        return wait;
    }

    private getPrefixedKey(key: string) {
        return this.name ? `${this.name}:${key}` : key;
    }

    public async has(key: string) {
        return await this.get(key) !== null;
    }

    public async get(key: string) {
        return this.client.get(this.getPrefixedKey(key));
    }

    public async getAllKeys() {
        return this.client.keys(this.getPrefixedKey('*'));
    }

    public async getAll() {
        const keys = await this.getAllKeys();
        const values = await Promise.all(keys.map((key) => this.client.get(key)));

        return values;
    }

    public async set(key: string, value: string) {
        const prefixedKey = this.getPrefixedKey(key);

        await this.client.set(prefixedKey, value);
    }

    public async delete(key: string) {
        const prefixedKey = this.getPrefixedKey(key);
        const prevValue = await this.client.get(prefixedKey);
        
        if (prevValue) {
            await this.client.del(prefixedKey);
        }
    }
}

export default RedisDatabase;