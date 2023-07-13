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
    type Result = StringLiteral<string>
    expectTypeOf<Result>().toEqualTypeOf<never>
  })

  it('should not match a non-string type', () => {
    type Result = StringLiteral<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should match a literal string', () => {
    type Result = StringLiteral<'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo'>()
  })
}
