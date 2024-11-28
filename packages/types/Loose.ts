import type { UnionMerge } from './UnionMerge'

/**
 * Make all `undefined` or `void` properties of T optional. This type is
 * similar to `Partial` but it only makes properties optional if they are
 * `undefined` or `void`. Meaning they non-`undefined` or non-`void` properties
 * will remain required.
 *
 * @template T The type to make optional
 * @returns A new type with all `undefined` or `void` properties of T optional
 * @example Loose<{ a: string | undefined, b: number }> // { a?: string, b: number }
 */
export type Loose<T> =
  T extends object
    ? T extends any[] ? T
      : UnionMerge<
        | { [P in keyof T as undefined extends T[P] ? never : P]: T[P]; }
        | { [P in keyof T as undefined extends T[P] ? P : never]?: T[P]; }
      > : T
