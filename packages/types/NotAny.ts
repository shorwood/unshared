/**
 * Matches a type that is not any.
 *
 * @template T Type to match.
 * @returns The type that is not any.
 * @example
 * // When T is not any, the result is T.
 * NotAny<number> // number
 *
 * // When T is any, the result is never.
 * NotAny<any> // never
 */
export type NotAny<T = unknown> = any extends T ? never : T

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match a type that is not any', () => {
    type Result = NotAny<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should not match a type that is any', () => {
    type Result = NotAny<any>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
