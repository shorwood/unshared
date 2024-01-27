import { CharacterDigit } from './CharacterDigit'
import { CharacterLower } from './CharacterLower'
import { CharacterSymbol } from './CharacterSymbol'
import { CharacterUpper } from './CharacterUpper'

/**
 * A whitespace character. This includes the space character, the tab character,
 * the line feed character, the carriage return character, and the vertical
 * tab character.
 */
export type CharacterWhitespace = ' ' | '\n' | '\r' | '\t' | '\v'

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  it('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  it('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  it('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  it('should match a whitespace character', () => {
    expectTypeOf<' ' | '\n' | '\r' | '\t' | '\v'>().toMatchTypeOf<CharacterWhitespace>()
  })
}
