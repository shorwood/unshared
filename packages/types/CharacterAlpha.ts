import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLetter } from './CharacterLetter'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

/**
 * A character that is either a letter or a digit.
 */
export type CharacterAlpha = CharacterDigit | CharacterLetter

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterAlpha>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterAlpha>()
  })

  test('should match a digit', () => {
    expectTypeOf<CharacterDigit>().toMatchTypeOf<CharacterAlpha>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterAlpha>()
  })
}
