import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

describe('CharacterSymbol', () => {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toExtend<CharacterSymbol>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toExtend<CharacterSymbol>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toExtend<CharacterSymbol>()
  })

  test('should match a symbol', () => {
    expectTypeOf<'!'>().toExtend<CharacterSymbol>()
  })
})
