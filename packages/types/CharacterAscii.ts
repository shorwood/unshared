import type { CharacterAlpha } from './CharacterAlpha'
import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

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
