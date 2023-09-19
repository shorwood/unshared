import { IsDecimal, IsEmptyString, IsPositive, IsString, IsZero, Substract } from './utils'

/**
 * Extract litteral types of strings separated by a delimiter.
 *
 * @template S String to extract litteral types from.
 * @template D Delimiter to split string with.
 * @template N Maximum number of splits. (Default: `128`)
 * @template R The list of tokens extracted so far. (Used internally)
 * @returns Litteral types of strings separated by a delimiter.
 * @example StringSplit<'Hello,World'> // ['Hello', 'World']
 */
export type StringSplit<S extends string, D extends string = ',', N extends number = 128, R extends string[] = []> =
  IsString<S> extends true ? string[]
    : IsEmptyString<S> extends true ? []
      : IsDecimal<N> extends true ? never
        : IsZero<N> extends true ? R

          // --- Split string.
          : S extends `${infer A extends string}${D}${infer Rest extends string}`

            // --- Skip empty strings.
            ? IsEmptyString<A> extends true ? StringSplit<Rest, D, N, R>

              // --- Recurse.
              : IsPositive<N> extends true
                ? [...R, A, ...StringSplit<Rest, D, Substract<N, 1>>]
                : never

            : [...R, S]

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return literrals split by a comma', () => {
    type Result = StringSplit<'Hello,World'>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return literrals split by a dash', () => {
    type Result = StringSplit<'Hello-World', '-'>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return literrals split by a comma with a maximum of 2 splits', () => {
    type Result = StringSplit<'Hello,World,Goodbye', ',', 2>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should handle separator at the end of the string', () => {
    type Result = StringSplit<'Hello,World,'>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should handle separator at the start of the string', () => {
    type Result = StringSplit<',Hello,World'>
    type Expected = ['Hello', 'World']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return each character of literral as litterals', () => {
    type Result = StringSplit<'Hello', ''>
    type Expected = ['H', 'e', 'l', 'l', 'o']
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return the string type', () => {
    type Result = StringSplit<string>
    type Expected = string[]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
