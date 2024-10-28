/**
 * The [NOR](https://en.wikipedia.org/wiki/NOR_gate) of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns `true` if both booleans are `false`.
 * @example BooleanNor<true, false> // false
 */
export type BooleanNor<A extends boolean, B extends boolean> =
  A extends true ? false : B extends true ? false : true
