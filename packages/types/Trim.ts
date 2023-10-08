import { CharacterWhitespace } from '@unshared/types'

/**
 * Removes the leading and trailing white space and line terminator
 * characters from a string.
 *
 * @template S The string to trim.
 * @returns The trimmed string.
 * @example trim(' Hello world ') // 'Hello world'
 */
export type Trim<S extends string> =
  S extends `${CharacterWhitespace}${infer R}` ? Trim<R> :
    S extends `${infer L}${CharacterWhitespace}` ? Trim<L> :
      S

/** c8 ignore next */
if (import.meta.vitest) {
  it('should remove spaces from both sides of a string', () => {
    type Result = Trim<' Hello world '>
    expectTypeOf<Result>().toEqualTypeOf<'Hello world'>()
  })

  it('should remove new lines from both sides of a string', () => {
    type Result = Trim<'\nHello world\n'>
    expectTypeOf<Result>().toEqualTypeOf<'Hello world'>()
  })

  it('should remove tabs from both sides of a string', () => {
    type Result = Trim<'\tHello world\t'>
    expectTypeOf<Result>().toEqualTypeOf<'Hello world'>()
  })
}
