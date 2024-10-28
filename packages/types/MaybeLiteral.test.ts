/* eslint-disable sonarjs/no-useless-intersection */
import type { MaybeLiteral } from './MaybeLiteral'

describe('MaybeLiteral', () => {
  test('should match a string type', () => {
    type Result = MaybeLiteral<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should match a literal string', () => {
    type Result = MaybeLiteral<'bar' | 'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'bar' | 'foo' | {} & string>()
  })
})
