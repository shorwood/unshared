import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

/**
 * A character digit.
 */
export type CharacterDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterDigit>()
  })

  it('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterDigit>()
  })

  it('should match a digit', () => {
    expectTypeOf<'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'>().toMatchTypeOf<CharacterDigit>()
  })

  it('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterDigit>()
  })
}
