import type { BooleanOr } from '@unshared/types'

/**
 * Computes the logical [OR](https://en.wikipedia.org/wiki/OR_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` or `b` is `true`.
 * @example or(false, true) // true
 */
export function or<A extends boolean, B extends boolean>(a: A, b: B): BooleanOr<A, B>

/**
 * Computes the logical [OR](https://en.wikipedia.org/wiki/OR_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if at least one of the values is `true`.
 * @example or(true, false, false, false) // true
 */
export function or(...values: boolean[]): boolean
export function or(...values: boolean[]): boolean {
  return values.some(Boolean)
}
