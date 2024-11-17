/* eslint-disable sonarjs/deprecation */
/**
 * Join the literal string withing the tuple into a union string type.
 *
 * @template T Tuple of strings to join.
 * @returns The union string type.
 * @example TupleJoin<['a' | 'b', 'c' | 'd']> // 'ac' | 'ad' | 'bc' | 'bd'
 * @deprecated Use `StringJoin` instead.
 */
export type TupleJoin<T extends string[]> =
  T extends [infer A extends string, ...infer B extends string[]]
    ? `${A}${TupleJoin<B>}`
    : ''
