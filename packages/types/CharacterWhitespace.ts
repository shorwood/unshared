import { CharacterUpper } from './CharacterUpper'
import { CharacterSymbol } from './CharacterSymbol'
import { CharacterLower } from './CharacterLower'
import { CharacterDigit } from './CharacterDigit'

/**
 * A whitespace character. This includes the space character, the tab character,
 * the line feed character, the carriage return character, and the vertical
 * tab character.
 */
export type CharacterWhitespace = ' ' | '\n' | '\r' | '\t' | '\v'

/* v8 ignore next */
if (import.meta.vitest) {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  test('should match a whitespace character', () => {
    expectTypeOf<' ' | '\n' | '\r' | '\t' | '\v'>().toMatchTypeOf<CharacterWhitespace>()
  })
}
