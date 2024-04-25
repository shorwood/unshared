/**
 * Infer a literal number from a literal string.
 *
 * @template N The literal string to infer from.
 * @returns The number inferred from the literal string.
 * @example
 * // Infer a literal number from a literal string
 * StringNumber<'-42.1'> // -42.1
 *
 * // Infer to number when a string is passed
 * StringNumber<string> // number
 *
 * // Infer to never when a non-number is passed
 * StringNumber<'a'> // never
 */
export type StringNumber<N extends string> =
  string extends N ? number :
    N extends `${infer S extends number}` ? S
      : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should infer a positive integer', () => {
    type Result = StringNumber<'42'>
    expectTypeOf<Result>().toEqualTypeOf<42>()
  })

  test('should infer a negative integer', () => {
    type Result = StringNumber<'-42'>
    expectTypeOf<Result>().toEqualTypeOf<-42>()
  })

  test('should infer a positive decimal', () => {
    type Result = StringNumber<'42.1'>
    expectTypeOf<Result>().toEqualTypeOf<42.1>()
  })

  test('should infer a negative decimal', () => {
    type Result = StringNumber<'-42.1'>
    expectTypeOf<Result>().toEqualTypeOf<-42.1>()
  })

  test('should infer number from a string', () => {
    type Result = StringNumber<string>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return never when a non-number is passed', () => {
    type Result = StringNumber<'a'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
