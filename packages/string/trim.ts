import type { CharacterWhitespace } from '@unshared/types'

/**
 * Removes the leading and trailing white space and line terminator
 * characters from a string.
 *
 * @template S The string to trim.
 * @returns The trimmed string.
 * @example trim(' Hello world ') // 'Hello world'
 */
export type Trimmed<S extends string> =
  S extends `${CharacterWhitespace}${infer R}` ? Trimmed<R> :
    S extends `${infer L}${CharacterWhitespace}` ? Trimmed<L> :
      S

/**
 * Removes the leading and trailing white space and line terminator
 * characters from a string. This function is a wrapper around the
 * `String.prototype.trim` method but allows to use it in a functional
 * manner. It also provides type inference for the new string.
 *
 * @param string The string to trim.
 * @returns The trimmed string.
 * @example trim(' Hello world ') // 'Hello world'
 */
export function trim<S extends string>(string: S): Trimmed<S> {
  return string.trim() as Trimmed<S>
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should remove whitespace from both sides of a string', () => {
    const result = trim(' Hello world ')
    expect(result).toEqual('Hello world')
    expectTypeOf(result).toEqualTypeOf<'Hello world'>()
  })
}
