import { attempt } from '@unshared/functions'
import { assertNumber, assertString, assertUndefined } from './assert/index'
import { createRuleSet } from './createRuleSet'

describe('createRuleSet', () => {
  describe('pass', () => {
    it('should create an assert rule from a single function', () => {
      const rule = createRuleSet([assertNumber])
      const result = rule(5)
      expect(result).toBe(5)
      expectTypeOf(result).toEqualTypeOf<number>()
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
    })

    it('should create a transform rule from a single chain', () => {
      const rule = createRuleSet([assertString, Number])
      const result = rule('5')
      expect(result).toBe(5)
      expectTypeOf(result).toEqualTypeOf<number>()
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
    })

    it('should create a set of rules from multiple chains and match the second chain', () => {
      const rule = createRuleSet([assertUndefined], [assertString, Number])
      const result = rule('5')
      expect(result).toBe(5)
      expectTypeOf(result).toEqualTypeOf<number | undefined>()
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number | undefined>()
    })

    it('should create a set of rules from multiple chains and match the first chain', () => {
      const rule = createRuleSet([assertUndefined], [assertString, Number])
      const result = rule(undefined)
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<number | undefined>()
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number | undefined>()
    })
  })

  describe('fail', () => {
    it('should throw an error if no rule passes', () => {
      const rule = createRuleSet([assertUndefined], [assertString, Number])
      const shouldThrow = () => rule(5)
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_RULE_SET_MISMATCH',
        message: 'No rule set passed.',
        context: {
          causes: [
            {
              name: 'E_NOT_UNDEFINED',
              message: 'Value is not undefined.',
              context: { value: 5, received: 'number' },
            },
            {
              name: 'E_NOT_STRING',
              message: 'Value is not a string.',
              context: { value: 5, received: 'number' },
            },
          ],
        },
      })
    })
  })

  describe('edge cases', () => {
    it('should throw an error if a rule is not a function', () => {
      // @ts-expect-error: testing invalid input
      const shouldThrow = () => createRuleSet([5])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Rule must be a function')
    })
  })
})
