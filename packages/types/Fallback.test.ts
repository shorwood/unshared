import type { Fallback } from './Fallback'

describe('Fallback', () => {
  test('should return the fallback type if the type is never', () => {
    type Result = Fallback<never, string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should fallback with never', () => {
    type Result = Fallback<never, never>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should not return the fallback type if the type is not never', () => {
    type Result = Fallback<string, number>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })
})
