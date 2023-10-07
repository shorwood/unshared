import type { CharacterDigit } from './CharacterDigit'
import type { CharacterSymbol } from './CharacterSymbol'

/**
 * A character that is either a digit or a hexadecimal lowercase letter.
 */
export type CharacterHex = CharacterDigit | 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match hexadecimal lowercase letters', () => {
    expectTypeOf<'a' | 'b' | 'c' | 'd' | 'e' | 'f'>().toMatchTypeOf<CharacterHex>()
  })

  it('should not match hexadecimal uppercase letters', () => {
    expectTypeOf<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>().not.toMatchTypeOf<CharacterHex>()
  })

  it('should match digits', () => {
    expectTypeOf<CharacterDigit>().toMatchTypeOf<CharacterHex>()
  })

  it('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterHex>()
  })
}
