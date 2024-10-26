import type { RuleLike, RuleResult } from './createRule'
import { createRule } from './createRule'

/** A tuple of `RuleLike` values that can be used to create a rule chain. */
export type RuleChainLike = RuleLike[]

/**
 * Infer the result type of a rule chain given a `RuleChainLike` value.
 *
 * @template T The type of the rule chain.
 * @example RuleChainResult<[RegExp, (value: string) => string]> = string
 */
export type RuleChainResult<T extends RuleChainLike> =
  T extends [infer U extends RuleLike] ? RuleResult<U>
    : T extends [...RuleLike[], infer U extends RuleLike] ? RuleResult<U>
      : never

/**
 * A tuple of rules that are executed in order until one fails.
 *
 * @template T The type of the rules in the chain.
 * @example RuleChain<[RegExp, (value: string) => string]> = [(value: unknown) => asserts value is string, (value: string) => string]
 */
export type RuleChain<T extends RuleChainLike = RuleChainLike> = (value: unknown) => RuleChainResult<T>

/**
 * Create a rule chain from a list of `RuleLike` values. This function can be used to create a
 * chain of rules that are executed in order until one fails.
 *
 * @param rules The `RuleLike` values to create the chain from.
 * @returns A rule chain that can be used to validate a value.
 * @example createRuleChain(assertString, /\w+@example\.com/) // (value: unknown) => string
 */
export function createRuleChain<T extends RuleChainLike>(...rules: Readonly<T>): RuleChain<T> {
  const compiled = rules.map(createRule)
  return function(this: unknown, value: unknown) {
    for (const rule of compiled) value = rule.call(this, value)
    return value
  } as RuleChain<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { assertString } = await import('./assert/assertString')
  const { attempt } = await import('@unshared/functions/attempt')

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
}
