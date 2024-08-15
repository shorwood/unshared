import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterUpper } from './CharacterUpper'

/**
 * A character symbol that is not a letter or a digit.
 */
export type CharacterSymbol =
  ' ' | '!' | '"' | '#' | '$' | '%' | '&' | '(' | ')' | '*' | '+' | ','
  |'.'| '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@' | '\'' | '-'

/* v8 ignore next */
if (import.meta.vitest) {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterSymbol>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterSymbol>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterSymbol>()
  })

  test('should match a symbol', () => {
    expectTypeOf<'!'>().toMatchTypeOf<CharacterSymbol>()
  })
}
