import { Decrease } from './arithmetic'

/**
 * Extract litteral types of strings separated by a delimiter.
 *
 * @param S String to extract litteral types from.
 * @param D Delimiter to split string with.
 * @param N Maximum number of splits. (default: `128`)
 * @returns Litteral types of strings separated by a delimiter.
 * @example StringSplit<'Hello,World'> // 'Hello' | 'World'
 */

export type StringSplit<S extends string, D extends string = ',', N extends number = 128> =
  N extends 0

    // --- Cutoff recursion
    ? never
    : S extends `${infer A}${D}${infer B}`
      ? `${A}` | StringSplit<B, D, Decrease<N>>

      // --- Last split
      : Exclude<`${S}`, ''>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return literrals split by a comma', () => {
    type result = StringSplit<'Hello,World'>
    expectTypeOf<result>().toEqualTypeOf<'Hello' | 'World'>()
  })

  it('should return literrals split by a dash', () => {
    type result = StringSplit<'Hello-World', '-'>
    expectTypeOf<result>().toEqualTypeOf<'Hello' | 'World'>()
  })

  it('should return literrals split by a comma with a maximum of 2 splits', () => {
    type result = StringSplit<'Hello,World,Goodbye', ',', 2>
    expectTypeOf<result>().toEqualTypeOf<'Hello' | 'World'>()
  })

  it('should return each character of literral as litterals', () => {
    type result = StringSplit<'Hello', ''>
    expectTypeOf<result>().toEqualTypeOf<'H' | 'e' | 'l' | 'o'>()
  })

  it('should return the string type', () => {
    type result = StringSplit<string>
    expectTypeOf<result>().toEqualTypeOf<string>()
  })
}
