/**
 * Infer a number from a literal string.
 *
 * @template N The literal string to infer from.
 * @returns The number inferred from the literal string.
 * @example StringNumber<'42'> // 42
 */
export type StringNumber<N extends string> =
  string extends N ? number :
    N extends `${infer S extends number}` ? S
      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should infer a positive integer', () => {
    type result = StringNumber<'42'>
    expectTypeOf<result>().toEqualTypeOf<42>()
  })

  it('should infer a negative integer', () => {
    type result = StringNumber<'-42'>
    expectTypeOf<result>().toEqualTypeOf<-42>()
  })

  it('should infer a positive decimal', () => {
    type result = StringNumber<'42.1'>
    expectTypeOf<result>().toEqualTypeOf<42.1>()
  })

  it('should infer a negative decimal', () => {
    type result = StringNumber<'-42.1'>
    expectTypeOf<result>().toEqualTypeOf<-42.1>()
  })

  it('should infer number from a string', () => {
    type result = StringNumber<string>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })

  it('should return never when a non-number is passed', () => {
    type result = StringNumber<'a'>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })
}
