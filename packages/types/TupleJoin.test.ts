/* eslint-disable sonarjs/deprecation */
import type { TupleJoin } from './TupleJoin'

describe('TupleJoin', () => {

  test('should join a tuple of single characters into a literal string', () => {
    type Result = TupleJoin<['a', 'b', 'c']>
    expectTypeOf<Result>().toEqualTypeOf<'abc'>()
  })

  test('should join a tuple of characters union into a literal string union', () => {
    type Result = TupleJoin<['a' | 'b', 'c' | 'd']>
    expectTypeOf<Result>().toEqualTypeOf<'ac' | 'ad' | 'bc' | 'bd'>()
  })

  test('should join a tuple of characters into a literal string', () => {
    type Result = TupleJoin<['abc', 'def']>
    expectTypeOf<Result>().toEqualTypeOf<'abcdef'>()
  })
})
