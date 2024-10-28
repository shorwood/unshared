import type { StringLiteral } from './StringLiteral'

describe('StringLiteral', () => {
  test('should not match a string type', () => {
    type Result = StringLiteral<string>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match a literal string', () => {
    type Result = StringLiteral<'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo'>()
  })
})
