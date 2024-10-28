import type { BooleanAnd } from '@unshared/types'

/**
 * Computes the logical [AND](https://en.wikipedia.org/wiki/AND_gate) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are both `true`.
 * @example and(true, true) // true
 */
export function and<A extends boolean, B extends boolean>(a: A, b: B): BooleanAnd<A, B>

/**
 * Computes the logical [AND](https://en.wikipedia.org/wiki/AND_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if all the values are `true`.
 * @example and(true, true, true, true) // true
 */
export function and(...values: boolean[]): boolean
export function and(...values: boolean[]): boolean {
  return values.every(Boolean)
}
