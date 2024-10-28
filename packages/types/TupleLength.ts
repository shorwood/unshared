/**
 * Get the length of a tuple
 *
 * @template T Tuple
 * @returns Length of tuple
 * @example TupleLength<[1, 2, 3]> // 3
 */
export type TupleLength<T extends unknown[]> =
  T extends { length: infer L extends number } ? L : never
