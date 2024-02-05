/**
 * A type that may match a literal string type. This type is useful for
 * allowing auto-completion in IDEs without losing the ability to match
 * non-literal string types.
 *
 * @template T Type to maybe match.
 * @returns The string type.
 * @example StringMaybeLitteral<'foo'> // 'foo' | (string & {})
 */
export type StringMaybeLitteral<T extends string> = T | (string & {})

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match a string type', () => {
    type Result = StringMaybeLitteral<string>
    expectTypeOf<Result>().toEqualTypeOf<string | (string & {})>()
  })

  it('should match a literal string', () => {
    type Result = StringMaybeLitteral<'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo' | (string & {})>()
  })
}
