/**
 * The XNOR of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns The XNOR of the two booleans
 * @example BooleanXnor<true, false> // false
 */
export type BooleanXnor<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? true : false : B extends true ? false : true
