export function add(lhs: number, rhs: number): number {
  return lhs + rhs;
}

export type ArrayRemoveFirst<T extends any[]> = T extends [first: unknown, ...rest: infer Rest] ? Rest : T;

export type DeepPartial<T> = T extends object
  ? {
      [key in keyof T]?: DeepPartial<T[key]>;
    }
  : T;
