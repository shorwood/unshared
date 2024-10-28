import type { IsArray } from './utils'

/**
 * Shifts a tuple to the left by one. If the tuple is empty or has one element,
 * an empty tuple is returned.
 *
 * @template T The tuple to shift.
 * @returns The tuple without the first element and the first element.
 * @example TupleShift<[1, 2, 3]> // [[2, 3], 1]
 */
export type TupleShift<T extends unknown[]> =
  IsArray<T> extends true
    ? T extends Array<infer U> ? [T, U] : never
    : T extends [infer U, ...infer V] ? [V, U] : [[], undefined]
