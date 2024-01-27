import { CharacterDigit } from './CharacterDigit'
import { CharacterLetter } from './CharacterLetter'
import { CharacterLower } from './CharacterLower'
import { CharacterSymbol } from './CharacterSymbol'
import { CharacterUpper } from './CharacterUpper'

/**
 * A character that is either a letter or a digit.
 */
export type CharacterAlpha = CharacterDigit | CharacterLetter

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterAlpha>()
  })

  it('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterAlpha>()
  })

  it('should match a digit', () => {
    expectTypeOf<CharacterDigit>().toMatchTypeOf<CharacterAlpha>()
  })

  it('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterAlpha>()
  })
}
