export enum Environment {
    Development = 'development',
    Test = 'test',
    Production = 'production',
}

export interface Auth {
    username: string,
    password: string,
}

export enum TimeUnit {
    Days = 'd',
    Hours = 'h',
    Minutes = 'm',
    Seconds = 's',
    Milliseconds = 'ms',
}

export interface VersionedData <Data> {
    version: number,
    data: Data,
}

export type DatedCounter = {
    count: number
    last: Date | null,
}

export interface Comparable {
    compare(other: Comparable): -1 | 0 | 1;
    smallerThan(other: Comparable): boolean;
    smallerThanOrEquals(other: Comparable): boolean;
    equals(other: Comparable): boolean;
    greaterThanOrEquals(other: Comparable): boolean;
    greaterThan(other: Comparable): boolean;
}

export interface DatabaseOptions {
    host: string,
    port: number,
    name: string,
    auth?: Auth,
}

export interface IKeyValueDatabase<R> {
    has(id: string): Promise<boolean>;
    get(id: string): Promise<R | null>;
    set(id: string, record: R): Promise<void>;
    delete(id: string): Promise<void>;
    flush(): Promise<void>;
}