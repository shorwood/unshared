/**
 * Concatenate two tuples together. This is a type-level equivalent of the
 * `concat` method on arrays.
 *
 * @template T1 The first tuple.
 * @template T2 The second tuple.
 * @returns The concatenated tuple.
 * @example TupleConcat<[1, 2], [3, 4]> // [1, 2, 3, 4]
 */
export type TupleConcat<T1 extends unknown[], T2 extends unknown[]> =
  T1 extends [...infer U1] ? T2 extends [...infer U2] ? [...U1, ...U2]
    : T1 : T2
