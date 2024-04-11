/**
 * Join the literal string withing the tuple into a union string type.
 *
 * @template T Tuple of strings to join.
 * @returns The union string type.
 * @example TupleJoin<['a' | 'b', 'c' | 'd']> // 'ac' | 'ad' | 'bc' | 'bd'
 */
export type TupleJoin<T extends string[]> =
  T extends [infer A extends string, ...infer B extends string[]]
    ? `${A}${TupleJoin<B>}`
    : ''

/** v8 ignore start */
if (import.meta.vitest) {

  it('should join a tuple of single characters into a literal string', () => {
    type Result = TupleJoin<['a', 'b', 'c']>
    expectTypeOf<Result>().toEqualTypeOf<'abc'>()
  })

  it('should join a tuple of characters union into a literal string union', () => {
    type Result = TupleJoin<['a' | 'b', 'c' | 'd']>
    expectTypeOf<Result>().toEqualTypeOf<'ac' | 'ad' | 'bc' | 'bd'>()
  })

  it('should join a tuple of characters into a literal string', () => {
    type Result = TupleJoin<['abc', 'def']>
    expectTypeOf<Result>().toEqualTypeOf<'abcdef'>()
  })
}
