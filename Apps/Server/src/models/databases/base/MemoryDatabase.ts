import logger from '../../../logger';
import { IKeyValueDatabase } from '../../../types';

class MemoryDatabase<R> implements IKeyValueDatabase<R> {
    protected db = new Map<string, R>();

    public async start() {
        logger.info(`Using in-memory database.`);
    }

    public async stop() {

    }

    public async has(id: string) {
        return this.db.has(id);
    }

    public async get(id: string) {
        return this.db.get(id) ?? null;
    }

    public async set(id: string, value: R) {
        this.db.set(id, value);
    }

    public async delete(id: string) {
        const prevValue = this.db.get(id) ?? null;

        if (prevValue) {
            this.db.delete(id);
        }
    }

    public async size() {
        return this.db.size;
    }

    public async getAllKeys() {
        return Array.from(this.db.keys());
    }

    public async getAllValues() {
        return Array.from(this.db.values());
    }

    public async getKeysByPattern(pattern: string) {
        throw new Error('NOT_IMPLEMENTED');
    }

    public async flush() {
        this.db = new Map();
    }
}

export default MemoryDatabase;