import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

describe('CharacterDigit', () => {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toExtend<CharacterDigit>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toExtend<CharacterDigit>()
  })

  test('should match a digit', () => {
    expectTypeOf<'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'>().toExtend<CharacterDigit>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toExtend<CharacterDigit>()
  })
})
