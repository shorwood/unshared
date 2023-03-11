/**
 * A literal string that is not a string type.
 *
 * @template T Type to match.
 * @returns The literal type.
 * @example StringLiteral<string> // Error: string is not a literal type
 */
export type StringLiteral<T> = string extends T ? T extends string ? never : T : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match a string type', () => {
    type result = StringLiteral<string>
    expectTypeOf<result>().toEqualTypeOf<never>
  })

  it('should not match a non-string type', () => {
    type result = StringLiteral<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should match a literal string', () => {
    type result = StringLiteral<'foo'>
    expectTypeOf<result>().toEqualTypeOf<'foo'>()
  })
}
