import type { CharacterAlpha } from './CharacterAlpha'
import type { CharacterDigit } from './CharacterDigit'
import type { CharacterLower } from './CharacterLower'
import type { CharacterSymbol } from './CharacterSymbol'
import type { CharacterUpper } from './CharacterUpper'

describe('CharacterAlpha', () => {
  test('should match lowercase letters', () => {
    expectTypeOf<CharacterLower>().toMatchTypeOf<CharacterAlpha>()
  })

  test('should match uppercase letters', () => {
    expectTypeOf<CharacterUpper>().toMatchTypeOf<CharacterAlpha>()
  })

  test('should match a digit', () => {
    expectTypeOf<CharacterDigit>().toMatchTypeOf<CharacterAlpha>()
  })

  test('should not match a symbol', () => {
    expectTypeOf<CharacterSymbol>().not.toMatchTypeOf<CharacterAlpha>()
  })
})
