import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

/**
 * A character letter that is either a lowercase or an uppercase letter.
 */
export type CharacterLetter = CharacterLower | CharacterUpper

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterLetter>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterLetter>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterLetter>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterLetter>()
  })
}
