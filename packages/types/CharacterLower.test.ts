import type { CharacterLower } from './CharacterLower'

describe('CharacterLower', () => {
  test('should match lowercase letters', () => {
    expectTypeOf<'a'>().toMatchTypeOf<CharacterLower>()
  })

  test('should not match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().not.toMatchTypeOf<CharacterLower>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterLower>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterLower>()
  })
})
