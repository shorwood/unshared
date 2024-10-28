import { attempt } from '@unshared/functions'
import { assertString } from './assert/index'
import { createRuleChain } from './createRuleChain'

describe('createRuleChain', () => {
  describe('rule chain', () => {
    it('should create a rule chain that parses and validates a string', () => {
      const ruleChain = createRuleChain(assertString, /\d+/, Number)
      const result = ruleChain('5')
      expect(result).toBe(5)
      expectTypeOf(result).toEqualTypeOf<number>()
      expectTypeOf(ruleChain).toEqualTypeOf<(value: unknown) => number>()
    })

    it('should throw the first error that occurs', () => {
      const ruleChain = createRuleChain(assertString, /\d+/, Number)
      const shouldThrow = () => ruleChain('hello')
      const { error } = attempt(shouldThrow)
      expect(error).toMatchObject({
        name: 'E_STRING_NOT_MATCHING',
        message: String.raw`String does not match the regular expression: /\d+/.`,
        context: { value: 'hello', pattern: /\d+/ },
      })
    })
  })

  describe('edge cases', () => {
    it('should throw an error if the parameter is not a rule', () => {
    // @ts-expect-error: Testing invalid input
      const shouldThrow = () => createRuleChain(5)
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Rule must be a function, RegExp or array, got number')
    })

    it('should throw an error if the rule parameter is a function', () => {
      // @ts-expect-error: This is an invalid test case
      const shouldThrow = () => createRuleChain([() => {}, () => {}])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Paremeterized rule must not have a function as second element')
    })

    it('should throw an error if the replacement is not a string', () => {
      // @ts-expect-error: This is an invalid test case
      const shouldThrow = () => createRuleChain([/World/, 1])
      expect(shouldThrow).toThrow(TypeError)
      expect(shouldThrow).toThrow('Remplacement rule must have a string as second element')
    })
  })
})
