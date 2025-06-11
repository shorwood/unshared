import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

describe('CharacterUpper', () => {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toExtend<CharacterUpper>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<'A'>().toExtend<CharacterUpper>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toExtend<CharacterUpper>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toExtend<CharacterUpper>()
  })
})
