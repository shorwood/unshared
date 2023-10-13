/**
 * Wrap a string type in a union with `string` to make it matchable with a
 * any string type that is not empty. This is useful for creating a type that
 * forces the user to not use an empty string.
 *
 * @template T String type to wrap.
 * @returns String constraint to a non-empty string.
 * @example NotStringEmpty<'foo' | ''> // 'foo'
 */
export type NotStringEmpty<T extends string> = T extends '' ? never : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a string type', () => {
    type Result = NotStringEmpty<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  it('should match a literal string', () => {
    type Result = NotStringEmpty<'bar' | 'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'bar' | 'foo'>()
  })

  it('should exclude an empty string', () => {
    type Result = NotStringEmpty<''>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
