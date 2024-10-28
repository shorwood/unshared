import type { NotAny } from './NotAny'

describe('NotAny', () => {
  test('should match a type that is not any', () => {
    type Result = NotAny<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should not match a type that is any', () => {
    type Result = NotAny<any>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
