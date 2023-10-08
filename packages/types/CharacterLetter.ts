import { CharacterDigit } from './CharacterDigit'
import { CharacterLower } from './CharacterLower'
import { CharacterSymbol } from './CharacterSymbol'
import { CharacterUpper } from './CharacterUpper'

/**
 * A character letter that is either a lowercase or an uppercase letter.
 */
export type CharacterLetter = CharacterLower | CharacterUpper

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterLetter>()
  })

  it('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterLetter>()
  })

  it('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterLetter>()
  })

  it('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterLetter>()
  })
}
