import type { CharacterLetter } from './CharacterLetter'

describe('CharacterLetter', () => {
  test('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterLetter>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterLetter>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterLetter>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterLetter>()
  })
})
