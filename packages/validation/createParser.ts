import { Immutable } from '@unshared/types'
import { ValidationError } from './ValidationError'
import { isRuleLike } from './isRuleLike'
import { RuleSet, RuleSetLike, createRuleSet } from './createRuleSet'
import { RuleChain, RuleChainLike } from './createRuleChain'

/**
 * Create a parser function given a list of rules or sets of rules.
 *
 * @param rules The rules to validate the value against.
 * @returns A parser function that can be used to validate a value.
 * @example createParser(/\d+/, Number) // (value: unknown) => number
 */
export function createParser<T extends RuleChainLike>(...rules: Immutable<T>): RuleChain<T>
export function createParser<T extends RuleSetLike>(...chains: Immutable<T>): RuleSet<T>
export function createParser(...rules: Immutable<RuleChainLike | RuleSetLike>): unknown {
  return rules.every(isRuleLike)
    ? createRuleSet([...rules])
    : createRuleSet(...rules)
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { isNumber, isStringNumber, isUndefined } = await import('./assert')

  test('should create a parser function from a single rule', () => {
    const rule = createParser(isStringNumber)
    const result = rule('5')
    expect(result).toBe('5')
    expectTypeOf(result).toEqualTypeOf<`${number}`>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => `${number}`>()
  })

  test('should create a parser function from a rule chain', () => {
    const rule = createParser(isStringNumber, Number)
    const result = rule('5')
    expect(result).toBe(5)
    expectTypeOf(result).toEqualTypeOf<number>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
  })

  test('should create a parser function from a rule set', () => {
    const rule = createParser([isStringNumber, Number], [isNumber], [isUndefined])
    const result = rule(5)
    expect(result).toBe(5)
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
    expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number | undefined>()
  })

  test('should throw a validation error if no rule passes', () => {
    const rule = createParser([isStringNumber, Number], [isNumber])
    const shouldThrow = () => rule('a')
    expect(shouldThrow).toThrow(ValidationError)
    expect(shouldThrow).toThrow('The value did not match any rule chain in the set.')
  })
}
