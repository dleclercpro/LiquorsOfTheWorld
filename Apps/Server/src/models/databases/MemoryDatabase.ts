export interface IKeyValueDatabase<R> {
    has(id: string): Promise<boolean>;
    get(id: string): Promise<R | null>;
    set(id: string, record: R): Promise<void>;
    delete(id: string): Promise<void>;
}



export class MemoryDatabase<R> implements IKeyValueDatabase<R> {
    protected db = new Map<string, R>();

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
        const values = await this.getAll();

        return values.length;
    }

    public async getAll() {
        return Object.values(this.db);
    }
}