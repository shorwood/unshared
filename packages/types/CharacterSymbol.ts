import { CharacterDigit } from './CharacterDigit'
import { CharacterLower } from './CharacterLower'
import { CharacterUpper } from './CharacterUpper'

/**
 * A character symbol that is not a letter or a digit.
 */
export type CharacterSymbol =
  ' ' | '-' | ',' | ';' | ':' | '!' | '?' | '.' | '"' | '(' | ')' | '@'
  |'*'| '/' | '\'' | '&' | '#' | '%' | '+' | '<' | '=' | '>' | '$'

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterSymbol>()
  })

  it('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterSymbol>()
  })

  it('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterSymbol>()
  })

  it('should match a symbol', () => {
    expectTypeOf<'!'>().toMatchTypeOf<CharacterSymbol>()
  })
}
