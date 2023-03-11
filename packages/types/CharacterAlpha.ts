import { CharacterDigit } from './CharacterDigit'
import { CharacterLetter } from './CharacterLetter'

/**
 * Matches a single character that is a letter or a digit.
 */
export type CharacterAlpha = CharacterLetter | CharacterDigit

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a letter', () => {
    type result = CharacterAlpha
    expectTypeOf<'a' | 'A'>().toMatchTypeOf<result>()
  })

  it('should match a digit', () => {
    type result = CharacterAlpha
    expectTypeOf<'0'>().toMatchTypeOf<result>()
  })

  it('should not match a symbol', () => {
    type result = CharacterAlpha
    expectTypeOf<'!'>().not.toMatchTypeOf<result>()
  })
}
