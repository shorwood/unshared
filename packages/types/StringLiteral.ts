/**
 * Matches a literal string type or never.
 *
 * @template T Type to match.
 * @returns The literal type.
 * @example
 * // Does not match a string type.
 * StringLiteral<string> // never
 *
 * // Matches a literal string.
 * StringLiteral<'foo'> // 'foo'
 */
export type StringLiteral<T extends string> =
  string extends T
    ? T extends string ? never
      : T : T

/* v8 ignore next */
if (import.meta.vitest) {
  test('should not match a string type', () => {
    type Result = StringLiteral<string>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should match a literal string', () => {
    type Result = StringLiteral<'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo'>()
  })
}
