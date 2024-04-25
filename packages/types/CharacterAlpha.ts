import { CharacterUpper } from './CharacterUpper'
import { CharacterSymbol } from './CharacterSymbol'
import { CharacterLower } from './CharacterLower'
import { CharacterLetter } from './CharacterLetter'
import { CharacterDigit } from './CharacterDigit'

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
