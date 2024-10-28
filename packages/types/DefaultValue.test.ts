import type { DefaultValue } from './DefaultValue'

describe('DefaultValue', () => {
  test('should default undefined to string', () => {
    type Result = DefaultValue<number | undefined, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  test('should default null to string', () => {
    type Result = DefaultValue<null | number, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  test('should default void to string', () => {
    type Result = DefaultValue<number | void, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  test('should not default when not undefined or null', () => {
    type Result = DefaultValue<number, string>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should default undefined to null', () => {
    type Result = DefaultValue<undefined, null>
    expectTypeOf<Result>().toEqualTypeOf<null>()
  })

  test('should default null to undefined', () => {
    type Result = DefaultValue<null, undefined>
    expectTypeOf<Result>().toEqualTypeOf<undefined>()
  })
})
