import type { OmitNever } from './OmitNever'

/**
 * Merged type of all the objects in the union.
 *
 * @template T The union to merge.
 * @example MergeUnion<{ a: number } | { b: string }> // { a: number, b: string }
 */
export type UnionMerge<T> =
  (T extends any ? (x: T) => any : never) extends (x: infer U) => any
    ? OmitNever<{ [P in keyof U]: U[P] }>
    : never
