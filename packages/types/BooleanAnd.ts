/**
 * The [AND](https://en.wikipedia.org/wiki/Logical_conjunction) of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns `true` if both booleans are `true`.
 * @example BooleanAnd<true, true> // true
 */
export type BooleanAnd<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? true : false : false
