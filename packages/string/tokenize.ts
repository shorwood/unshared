import { BooleanAnd } from '@unshared/types/BooleanAnd'
import { BooleanNot } from '@unshared/types/BooleanNot'
import { CharacterLower } from '@unshared/types/CharacterLower'
import { CharacterAlpha } from '@unshared/types/CharacterAlpha'

type IsLower<S extends string> = S extends CharacterLower ? true : false
type IsAlpha<S extends string> = S extends CharacterAlpha ? true : false
type IsCaseChange<S1 extends string, S2 extends string> = BooleanAnd<IsLower<S1>, BooleanNot<IsLower<S2>>>

/**
 * Extract the tokens from a string. Each token is a sequence of characters
 * that are separated by a non-alphanumeric character or by a change in case.
 *
 * @template S The string to convert.
 * @template T The current token.
 * @template R The list of tokens extracted so far.
 * @returns The camel case string.
 * @example Tokenize<'foo-bar'> // => ['foo', 'bar']
 */
export type Tokenize<S extends string, T extends string = '', R extends string[] = []> =
  S extends `${infer S1}${infer S2}${infer Rest}`

    // --- If character is not alphanumeric, skip.
    ? IsAlpha<S1> extends false ? Tokenize<`${S2}${Rest}`, T, R>

      // --- First 2 characters are both lower case. Append to current token.
      // --- If not, append current token to list of tokens.
      : IsCaseChange<S1, S2> extends true
        ? Tokenize<`${S2}${Rest}`, '', [...R, Lowercase<`${T}${S1}`>]>
        : Tokenize<`${S2}${Rest}`, `${T}${S1}`, R>

    // --- If only 1 character left, append to current token.
    : [...R, Lowercase<`${T}${S}`>]

type TokenizeTest = Tokenize<'Foo123Bar'> // ['foo', 'Bar']

const isNumber = (char: number) => char >= 48 && char <= 57
const isAlpha = (char: number) => isLower(char) || isUpper(char)
const isAlphaNumeric = (char: number) => isAlpha(char) || isNumber(char)

/**
 * Tokenize a string into an array of strings. Each token is a sequence of
 * characters that are separated by a non-alphanumeric character or by a
 * change in case.
 *
 * @param value The string to tokenize into an array of tokens.
 * @returns The list of tokens extracted from the string.
 * @example tokenize('fooBar') // => ['foo', 'Bar']
 */
export const tokenize = (value: string): string[] => {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Extract all tokens.
  value = value.trim()
  const tokens: string[]
  const indexStart = 0
  const indexEnd = 0

  // --- Extract tokens.
  for (let index = 0; index < value.length; index++) {
    const charN1 = value.charCodeAt(index)
    const charN2 = value.charCodeAt(index + 1)

    // --- If character is not alphanumeric, skip.
    if (!isLower && !isUpper && !isNumber) continue
  }

  // --- Return tokens as an array of strings.
  return [...tokens].map(token => token[0])
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', ['camel', 'Case']],
    ['PascalCase', ['Pascal', 'Case']],
    ['snake_case', ['snake', 'case']],
    ['kebab-case', ['kebab', 'case']],
    ['Title Case', ['Title', 'Case']],
    ['UPPER CASE', ['UPPER', 'CASE']],
    ['lower case', ['lower', 'case']],
  ])('should tokenize %s', (input, expected) => {
    const result = tokenize(input)
    expect(result).toEqual(expected)
  })

  it('should handle numbers as tokens', () => {
    const result = tokenize('Foo123Bar')
    expect(result).toEqual(['Foo', '123', 'Bar'])
  })

  it('should tokenize empty string', () => {
    const result = tokenize('\n\t\r ')
    expect(result).toEqual([])
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => tokenize(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
