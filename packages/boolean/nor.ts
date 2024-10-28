import type { BooleanNor } from '@unshared/types'

/**
 * Computes the logical [NOR](https://en.wikipedia.org/wiki/NOR_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean
 * @returns `true` if `a` and `b` are `false`.
 * @example nor(false, true) // false
 */
export function nor<A extends boolean, B extends boolean>(a: A, b: B): BooleanNor<A, B>

/**
 * Computes the logical [NOR](https://en.wikipedia.org/wiki/NOR_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if all the values are `false`.
 * @example nor(false, false, false, false) // true
 */
export function nor(...values: boolean[]): boolean
export function nor(...values: boolean[]): boolean {
  return values.every(a => !a)
}
