/**
 * The OR of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns The OR of the two booleans
 * @example BooleanOr<true, false> // true
 */
export type BooleanOr<A extends boolean, B extends boolean> =
  A extends true ? true : B extends true ? true : false
