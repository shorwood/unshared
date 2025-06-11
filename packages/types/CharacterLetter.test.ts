import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLetter } from './CharacterLetter'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

describe('CharacterLetter', () => {
  test('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toExtend<CharacterLetter>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toExtend<CharacterLetter>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toExtend<CharacterLetter>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toExtend<CharacterLetter>()
  })
})
