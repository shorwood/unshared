import type { CharacterUpper } from './CharacterUpper'

describe('CharacterUpper', () => {
  test('should not match lowercase letters', () => {
    expectTypeOf<CharacterLower>().not.toMatchTypeOf<CharacterUpper>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<'A'>().toMatchTypeOf<CharacterUpper>()
  })

  test('should not match a digit', () => {
    expectTypeOf<CharacterDigit>().not.toMatchTypeOf<CharacterUpper>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterUpper>()
  })
})
