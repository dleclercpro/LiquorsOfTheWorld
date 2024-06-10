import { ADMINS, REDIS_DATABASE, REDIS_ENABLE, REDIS_OPTIONS, USERS } from '../../config';
import RedisDatabase from './base/RedisDatabase';
import MemoryDatabase from './base/MemoryDatabase';
import User from '../users/User';
import { UserType } from '../../constants';

class AppDatabase {
    private db: RedisDatabase | MemoryDatabase<string>;

    public constructor() {
        this.db = (REDIS_ENABLE ?
            new RedisDatabase(REDIS_OPTIONS, REDIS_DATABASE) :
            new MemoryDatabase<string>() // Fallback database: in-memory
        );
    }

    public async setup() {
        // Create admin users if they don't already exist
        for (const { username, password } of ADMINS) {
            const admin = await User.get(username);
            if (!admin) {
                await User.create({ username, password }, UserType.Admin);
            }
        }

        // Create regular users if they don't already exist
        for (const { username, password } of USERS) {
            const user = await User.get(username);
            if (!user) {
                await User.create({ username, password }, UserType.Regular);
            }
        }
    }

    public async start() {
        if (!this.db) throw new Error('MISSING_DATABASE');
        await this.db.start();
    }

    public async stop() {
        if (!this.db) throw new Error('MISSING_DATABASE');
        await this.db.stop();
    }

    public async has(key: string) {
        return this.db.has(key);
    }

    public async get(key: string) {
        return this.db.get(key);
    }

    public async set(key: string, value: string) {
        return this.db.set(key, value);
    }

    public async delete(key: string) {
        return this.db.delete(key);
    }

    public async flush() {
        return this.db.flush();
    }

    public async getAllKeys() {
        return this.db.getAllKeys();
    }

    public async getAllValues() {
        return this.db.getAllValues();
    }

    public async getKeysByPattern(pattern: string) {
        const keys = await this.db.getKeysByPattern(pattern);
        return keys || [];
    }
}

export default AppDatabase;