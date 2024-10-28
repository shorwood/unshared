import type { BooleanXor } from '@unshared/types'

/**
 * Computes the logical [XOR](https://en.wikipedia.org/wiki/Exclusive_or) of the given booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are different.
 * @example xor(false, true) // true
 */
export function xor<A extends boolean, B extends boolean>(a: A, b: B): BooleanXor<A, B>

/**
 * Computes the logical [XOR](https://en.wikipedia.org/wiki/Exclusive_or) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if some of the values are different.
 * @example xor(true, false, true, false) // true
 */
export function xor(...values: boolean[]): boolean
export function xor(...values: boolean[]): boolean {
  return values.some((a, i, array) => a !== array[0])
}
