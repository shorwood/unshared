import type { CharacterDigit } from './CharacterDigit'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

/**
 * A lowercase characters from the [ASCII character set](https://www.wikiwand.com/en/ASCII#Printable_characters)
 */
export type CharacterLower =
  'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' |
  'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match lowercase letters', () => {
    expectTypeOf<'a'>().toMatchTypeOf<CharacterLower>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterLower>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterLower>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterLower>()
  })
}
