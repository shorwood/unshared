/**
 * A literal string that is not a string type.
 *
 * @param T Type to match.
 * @returns The literal type.
 * @example StringLiteral<string> // Error: string is not a literal type
 */
export type StringLiteral<T extends string> = string extends T ? never : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match a string type', () => {
    type result = StringLiteral<string>
    expectTypeOf<result>().toEqualTypeOf<never>
  })

  it('should match a literal string', () => {
    type result = StringLiteral<'foo'>
    expectTypeOf<result>().toMatchTypeOf<'foo'>()
  })
}
