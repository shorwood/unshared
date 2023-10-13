/**
 * Wrap a literal type in a union with `string` to make it matchable with a
 * any string type. This is useful for creating a type that can be used to
 * access nested properties of an object allowing comprehensive autocompletion
 * and type checking without forcing the user to use a string literal union.
 *
 * @template T Literal type to wrap.
 * @returns Literal type wrapped in a union with `string & {}`.
 * @example MaybeLiteral<'foo'> // 'foo' | (string & {})
 */
export type MaybeLiteral<T extends string> = T | (string & {})

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a string type', () => {
    type Result = MaybeLiteral<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  it('should match a literal string', () => {
    type Result = MaybeLiteral<'bar' | 'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'bar' | 'foo' | string & {}>()
  })
}
