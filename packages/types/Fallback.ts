/**
 * Fallback to a type if the first type is never. This type allows you to
 * provide a fallback without overriding the source type. For example, when you
 * want to fallback a string literal to a string.
 *
 * @template T The type to wrap.
 * @template U The type to return if T is never.
 * @example Fallback<never, string> // string
 */
export type Fallback<T, U> = T[] extends never[] ? U : T

/* v8 ignore next */
if (import.meta.vitest) {
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
}
