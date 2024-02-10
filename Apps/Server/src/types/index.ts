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

export interface Comparable {
    compare(other: Comparable): -1 | 0 | 1;
    smallerThan(other: Comparable): boolean;
    smallerThanOrEquals(other: Comparable): boolean;
    equals(other: Comparable): boolean;
    greaterThanOrEquals(other: Comparable): boolean;
    greaterThan(other: Comparable): boolean;
}

export type User = {
    email: string,
}