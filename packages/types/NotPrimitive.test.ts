import type { NotPrimitive } from './NotPrimitive'

describe('NotPrimitive', () => {
  test('should exclude primitives', () => {
    type Result = NotPrimitive<number | object | string>
    expectTypeOf<Result>().toEqualTypeOf<object>()
  })

  test('should match non-primitives', () => {
    expectTypeOf<object>().toMatchTypeOf<NotPrimitive>()
  })

  test('should not match primitives', () => {
    expectTypeOf<string>().not.toMatchTypeOf<NotPrimitive>()
  })
})
