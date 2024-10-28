import type { CharacterWhitespace } from './CharacterWhitespace'

describe('CharacterWhitespace', () => {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterWhitespace>()
  })

  test('should match a whitespace character', () => {
    expectTypeOf<' ' | '\n' | '\r' | '\t' | '\v'>().toMatchTypeOf<CharacterWhitespace>()
  })
})
