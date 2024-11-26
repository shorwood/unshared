import type { UnionMerge } from './UnionMerge'

/**
 * Override the properties of T with the properties of U and keep the rest.
 *
 * @template T The object to overwrite.
 * @template U The object to overwrite with.
 * @example Override<{ a: string, b: number }, { a: number }> // { a: number, b: number }
 */
export type Override<T, U> =
  UnionMerge<
    | { [P in keyof T as P extends keyof U ? [U[P]] extends [never] ? P : never : P]: T[P] }
    | { [P in keyof U as [U[P]] extends [never] ? never : P]: U[P] }
  >
