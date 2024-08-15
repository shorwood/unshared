import type { CharacterDigit } from './CharacterDigit'
import type { CharacterSymbol } from './CharacterSymbol'

/**
 * A character that is either a digit or a hexadecimal lowercase letter.
 */
export type CharacterHex = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | CharacterDigit

/* v8 ignore next */
if (import.meta.vitest) {
  test('should match hexadecimal lowercase letters', () => {
    expectTypeOf<'a' | 'b' | 'c' | 'd' | 'e' | 'f'>().toMatchTypeOf<CharacterHex>()
  })

  test('should not match hexadecimal uppercase letters', () => {
    expectTypeOf<'A' | 'B' | 'C' | 'D' | 'E' | 'F'>().not.toMatchTypeOf<CharacterHex>()
  })

  test('should match digits', () => {
    expectTypeOf<CharacterDigit>().toMatchTypeOf<CharacterHex>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterHex>()
  })
}
