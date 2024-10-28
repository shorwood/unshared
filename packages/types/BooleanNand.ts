/**
 * The [NAND](https://en.wikipedia.org/wiki/NAND_logic) of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns `true` if at least one of the booleans is `false`.
 * @example BooleanNand<true, false> // true
 */
export type BooleanNand<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? false : true : true
