import type { CharacterAlpha } from './CharacterAlpha'
import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

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
