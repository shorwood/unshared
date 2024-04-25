import { CharacterUpper } from './CharacterUpper'
import { CharacterSymbol } from './CharacterSymbol'
import { CharacterLower } from './CharacterLower'
import { CharacterDigit } from './CharacterDigit'
import { CharacterAlpha } from './CharacterAlpha'

/**
 * A character that is either a letter, a digit, or a symbol from the ASCII character set.
 */
export type CharacterAscii = CharacterAlpha | CharacterSymbol

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterAscii>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterAscii>()
  })

  test('should match a digit', () => {
    expectTypeOf<CharacterDigit>().toMatchTypeOf<CharacterAscii>()
  })

  test('should match a symbol', () => {
    expectTypeOf<CharacterSymbol>().toMatchTypeOf<CharacterAscii>()
  })
}
