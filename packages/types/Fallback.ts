/**
 * Fallback to a type if the first type is never. This type allows you to
 * provide a fallback without overriding the source type. For example when
 * you are using type predicates that return literal types, you can use this
 * type to fallback to the original type.
 *
 * @template T The type to wrap.
 * @template U The type to return if T is never.
 * @example
 * Fallback<never, string> // string
 * Fallback<Literal, string> // 'a' | 'b' | 'c'
 */
export type Fallback<T, U> =
  // If T is never, return U.
  T[] extends never[] ? U : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return the fallback type if the type is never', () => {
    type result = Fallback<never, string>
    expectTypeOf<result>().toEqualTypeOf<string>()
  })

  it('should fallback with never', () => {
    type result = Fallback<never, never>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not return the fallback type if the type is not never', () => {
    type result = Fallback<string, number>
    expectTypeOf<result>().toEqualTypeOf<string>()
  })
}
