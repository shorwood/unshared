/**
 * A string that is not a literal type. This is useful for matching a string
 * type without overriding the literal type. Allowing autocompletion of literal
 * types without forcing the user to manually type the literal type.
 *
 * @template T Type to match.
 * @returns The literal type.
 * @example StringNotLiteral<'foo'> // 'foo' | (string & {})
 */
export type StringNotLiteral<T = unknown> =
  unknown extends T ? string | (string & {})
    : string extends T ? string
      : T extends string ? T | (string & {})
        : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return a non-literal string', () => {
    type Result = StringNotLiteral
    expectTypeOf<Result>().toEqualTypeOf<string & {}>()
  })

  it('should match a string type', () => {
    type Result = StringNotLiteral<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  it('should match a non-string type', () => {
    type Result = StringNotLiteral<number>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should match a literal string', () => {
    type Result = StringNotLiteral<'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo' | (string & {})>()
  })
}
