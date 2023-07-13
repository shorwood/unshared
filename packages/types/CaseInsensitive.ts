/**
 * Matches a case-insensitive literal string.
 *
 * @template S The string to match.
 * @example CaseInsensitive<'FOO'> // 'foo' | 'Foo' | 'fOO' | 'FOO' ...
 */
export type CaseInsensitive<S extends string> =
  S extends `${infer L}${infer R}`
    ? `${Lowercase<L>}${CaseInsensitive<R>}` | `${Uppercase<L>}${CaseInsensitive<R>}`
    : S

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match case-insensitive strings', () => {
    type Result = CaseInsensitive<'foo'>
    type Expected = 'foo' | 'Foo' | 'fOO' | 'FOO' | 'foO' | 'FoO' | 'fOo' | 'FOo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should match case-insensitive strings with numbers', () => {
    type Result = CaseInsensitive<'foo123'>
    type Expected = 'foo123' | 'Foo123' | 'fOO123' | 'FOO123' | 'foO123' | 'FoO123' | 'fOo123' | 'FOo123'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return string if S is string', () => {
    type Result = CaseInsensitive<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })
}
