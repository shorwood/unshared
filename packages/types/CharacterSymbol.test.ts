import type { CharacterSymbol } from './CharacterSymbol'

describe('CharacterSymbol', () => {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterSymbol>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterSymbol>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterSymbol>()
  })

  test('should match a symbol', () => {
    expectTypeOf<'!'>().toMatchTypeOf<CharacterSymbol>()
  })
})
