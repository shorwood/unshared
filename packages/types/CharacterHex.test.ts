import type { CharacterDigit } from './CharacterDigit'
import type { CharacterHex } from './CharacterHex'
import type { CharacterSymbol } from './CharacterSymbol'

describe('CharacterHex', () => {
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
})
