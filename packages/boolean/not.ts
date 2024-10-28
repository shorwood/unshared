import type { BooleanNot } from '@unshared/types'

/**
 * Computes the [NOT](https://en.wikipedia.org/wiki/NOT_gate) of a boolean.
 *
 * @param a The boolean to negate.
 * @returns `true` if `a` is `false`.
 * @example not(false) // true
 */
export function not<A extends boolean>(a: A): BooleanNot<A> {
  return !a as BooleanNot<A>
}
