import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'

/**
 * An uppercase characters from the [ASCII character set](https://www.wikiwand.com/en/ASCII#Printable_characters)
 */
export type CharacterUpper =
  'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' |
  'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'

/* v8 ignore next */
if (import.meta.vitest) {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterUpper>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<'A'>().toMatchTypeOf<CharacterUpper>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterUpper>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterUpper>()
  })
}
