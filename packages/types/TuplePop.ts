import type { IsArray } from './utils'

/**
 * Pop the last element of a tuple type. If the tuple is empty or has one element,
 * an empty tuple is returned.
 *
 * @template T The tuple to pop.
 * @returns The tuple without the last element and the last element.
 * @example TuplePop<[1, 2, 3]> // [[1, 2], 3]
 */
export type TuplePop<T extends unknown[]> =
  IsArray<T> extends true
    ? T extends Array<infer U> ? [T, U] : never
    : T extends [...infer U, infer V] ? [U, V] : [[], undefined]
