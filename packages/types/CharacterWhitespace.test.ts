import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'
import type { CharacterWhitespace } from './CharacterWhitespace'

describe('CharacterWhitespace', () => {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toExtend<CharacterWhitespace>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toExtend<CharacterWhitespace>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toExtend<CharacterWhitespace>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toExtend<CharacterWhitespace>()
  })

  test('should match a whitespace character', () => {
    expectTypeOf<' ' | '\n' | '\r' | '\t' | '\v'>().toExtend<CharacterWhitespace>()
  })
})
