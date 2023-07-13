import { CharacterAlpha } from './CharacterAlpha'
import { CharacterDigit } from './CharacterDigit'
import { CharacterLower } from './CharacterLower'
import { CharacterSymbol } from './CharacterSymbol'
import { CharacterUpper } from './CharacterUpper'

/**
 * A character that is either a letter, a digit, or a symbol from the ASCII character set.
 */
export type CharacterAscii = CharacterAlpha | CharacterSymbol

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterAscii>()
  })

  it('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterAscii>()
  })

  it('should match a digit', () => {
    expectTypeOf<CharacterDigit>().toMatchTypeOf<CharacterAscii>()
  })

  it('should match a symbol', () => {
    expectTypeOf<CharacterSymbol>().toMatchTypeOf<CharacterAscii>()
  })
}
