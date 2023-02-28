/**
 * Default a value by another value. Meaning that if the first value is
 * undefined or null, the second value will be used instead.
 *
 * @template T The value to default
 * @template U The value to default with
 * @returns The defaulted value
 * @example DefaultValue<number | undefined, string> // number | string
 */
export type DefaultValue<T, U> =
  T extends undefined | null | never
    ? Exclude<T, undefined | null | never> | U
    : U extends undefined | null | never
      ? Exclude<U, undefined | null | never> | T
      : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should default undefined to string', () => {
    type result = DefaultValue<number | undefined, string>
    expectTypeOf<result>().toEqualTypeOf<number | string>()
  })

  it('should default null to string', () => {
    type result = DefaultValue<number | null, string>
    expectTypeOf<result>().toEqualTypeOf<number | string>()
  })

  it('should default undefined to null', () => {
    type result = DefaultValue<number | undefined, null>
    expectTypeOf<result>().toEqualTypeOf<number | null>()
  })

  it('should default null to undefined', () => {
    type result = DefaultValue<number | null, undefined>
    expectTypeOf<result>().toEqualTypeOf<number | undefined>()
  })
}
