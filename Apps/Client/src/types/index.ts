export type Auth = {
  username: string,
  password: string,
}

export interface Comparable {
  compare(other: Comparable): -1 | 0 | 1;
  smallerThan(other: Comparable): boolean;
  smallerThanOrEquals(other: Comparable): boolean;
  equals(other: Comparable): boolean;
  greaterThanOrEquals(other: Comparable): boolean;
  greaterThan(other: Comparable): boolean;
}