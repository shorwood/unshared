/**
 * The XOR of two booleans.
 *
 * @template A The first boolean
 * @template B The second boolean
 * @returns The XOR of the two booleans
 * @example BooleanXor<true, false> // true
 */
export type BooleanXor<A extends boolean, B extends boolean> =
  A extends true ? B extends true ? false : true : B extends true ? true : false
