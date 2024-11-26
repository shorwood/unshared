import type { UnionMerge } from './UnionMerge'
import type { Substract } from './utils'

/**
 * Make all nested `undefined` or `void` properties of T optional. This type is
 * similar to `Partial` but it only makes properties optional if they are
 * `undefined` or `void`. Meaning they non-`undefined` or non-`void` properties
 * will remain required.
 *
 * @template T The type to make optional
 * @template D The maximum depth to recurse to in T. This is to prevent infinite recursion and is set to `16` by default.
 * @returns A new type with all nested `undefined` or `void` properties of T optional
 * @example LooseDeep<{ a: { b: string | undefined, c: number } | undefined }> // { a?: { b?: string, c: number } }
 */
export type LooseDeep<T, D extends number = 16> =
  D extends 0 ? T
    : T extends object
      ? T extends Array<infer U> ? Array<LooseDeep<U, Substract<D, 1>>>
        : T extends ReadonlyArray<infer U> ? ReadonlyArray<LooseDeep<U, Substract<D, 1>>>
          : UnionMerge<
            { [P in keyof T as undefined extends T[P] ? P : never]?: LooseDeep<T[P], Substract<D, 1>> } |
            { [P in keyof T as undefined extends T[P] ? never : P]: LooseDeep<T[P], Substract<D, 1>> }
          >
      : T
