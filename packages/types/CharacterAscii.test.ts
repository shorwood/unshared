import type { CharacterAscii } from './CharacterAscii'
import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

describe('CharacterAscii', () => {
  test('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterAscii>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterAscii>()
  })

  test('should match a digit', () => {
    expectTypeOf<CharacterDigit>().toMatchTypeOf<CharacterAscii>()
  })

  test('should match a symbol', () => {
    expectTypeOf<CharacterSymbol>().toMatchTypeOf<CharacterAscii>()
  })
})
