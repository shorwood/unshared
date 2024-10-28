import type { BooleanNand } from '@unshared/types'

/**
 * Computes the logical [NAND](https://en.wikipedia.org/wiki/NAND_gate) of two booleans.
 *
 * @param a The first boolean.
 * @param b The second boolean.
 * @returns `true` if `a` and `b` are `false`.
 * @example nand(false, true) // true
 */
export function nand<A extends boolean, B extends boolean>(a: A, b: B): BooleanNand<A, B>

/**
 * Computes the logical [NAND](https://en.wikipedia.org/wiki/NAND_gate) of the given booleans.
 *
 * @param values The booleans to compare.
 * @returns `true` if some of the values are `false`.
 * @example nand(false, false, false, false) // true
 */
export function nand(...values: boolean[]): boolean
export function nand(...values: boolean[]): boolean {
  return values.some(a => !a)
}
