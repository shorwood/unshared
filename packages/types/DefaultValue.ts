import type { Nil } from './Nil'

/**
 * Default a value by another value. Meaning that if the first value is
 * undefined or null, the second value will be used instead.
 *
 * @template T The type to default
 * @template U The type to default with
 * @returns The defaulted value
 * @example DefaultValue<number | undefined, string> // number | string
 */
export type DefaultValue<T, U> = T extends Nil ? U : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should default undefined to string', () => {
    type Result = DefaultValue<number | undefined, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  it('should default null to string', () => {
    type Result = DefaultValue<number | null, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  it('should default void to string', () => {
    type Result = DefaultValue<number | void, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  it('should not default when not undefined or null', () => {
    type Result = DefaultValue<number, string>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should default undefined to null', () => {
    type Result = DefaultValue<undefined, null>
    expectTypeOf<Result>().toEqualTypeOf<null>()
  })

  it('should default null to undefined', () => {
    type Result = DefaultValue<null, undefined>
    expectTypeOf<Result>().toEqualTypeOf<undefined>()
  })
}
