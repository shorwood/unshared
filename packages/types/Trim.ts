import type { CharacterWhitespace } from '@unshared/types'

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
