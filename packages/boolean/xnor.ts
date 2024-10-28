import type { BooleanXnor } from '@unshared/types'

/**
 * Computes the logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are the same.
 * @example xnor(false, true) // false
 */
export function xnor<A extends boolean, B extends boolean>(a: A, b: B): BooleanXnor<A, B>

/**
 * Computes the logical [XNOR](https://en.wikipedia.org/wiki/XNOR_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if all the values are the same.
 * @example xnor(false, false, false, false) // true
 */
export function xnor(...values: boolean[]): boolean
export function xnor(...values: boolean[]): boolean {
  return values.every((a, i, array) => a === array[0])
}
