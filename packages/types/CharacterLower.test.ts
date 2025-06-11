import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

describe('CharacterLower', () => {
  test('should match lowercase letters', () => {
    expectTypeOf<'a'>().toExtend<CharacterLower>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toExtend<CharacterLower>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toExtend<CharacterLower>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toExtend<CharacterLower>()
  })
})
