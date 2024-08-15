import type { Nil } from '@unshared/types'

/**
 * Default a value by another value. Meaning that if the first value is
 * undefined or null, the second value will be used instead.
 *
 * @template T1 The type to default
 * @template T2 The type to default with
 * @returns The defaulted value
 * @example DefaultValue<number | undefined, string> // number | string
 */
export type DefaultValue<T1, T2> = T1 extends Nil ? T2 : T1

/** v8 ignore start */
if (import.meta.vitest) {
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
}
