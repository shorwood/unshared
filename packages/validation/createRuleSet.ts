import { Immutable } from '@unshared/types'
import { ValidationError } from './ValidationError'
import { RuleChainLike, RuleChainResult, createRuleChain } from './createRuleChain'
import { RuleLike } from './createRule'

/** A matrix of `RuleLike` values that can be used to create a rule set. */
export type RuleSetLike = RuleLike[][]

/**
 * Infer the result type of a rule set given a `RuleSetLike` value.
 *
 * @template T The type of the rule set.
 * @example RuleSetResult<[[RegExp], [NumberConstructor]]> = string | number
 */
export type RuleSetResult<T extends RuleSetLike> =
  T extends Array<infer U extends RuleChainLike> ? RuleChainResult<U> : never

/**
 * A tuple of rule chains that are tested in order until one matches.
 *
 * @template T The type of the rule chains in the set.
 * @example RuleSet<[RegExp, (value: string) => string]> = [(value: unknown) => string, (value: string) => string]
 */
export type RuleSet<T extends RuleSetLike = RuleSetLike> =
  (value: unknown) => RuleSetResult<T>

/**
 * Create a rule set from a list of `RuleChain` values. This function can be used to create a
 * set of rules that can be used to validate a value against at least one rule chain in the set.
 *
 * @param chains The `RuleChain` values to create the set from.
 * @returns A rule chain that can be used to validate a value.
 * @example createRuleChain(isString, /\w+@example\.com/) // (value: unknown) => string
 */
export function createRuleSet<T extends RuleSetLike>(...chains: Immutable<T>): RuleSet<T> {
  const compiled = chains.map(chain => createRuleChain(...chain))
  return function(this: object, value: unknown) {
    const causes: Error[] = []

    // --- For each rule set, validate the value. If one chain passes, return
    // --- the transformed value. If no chain passes, throw a validation error.
    for (const set of compiled) {
      try { return set.call(this, value) }
      catch (error) { causes.push(error as Error) }
    }

    // --- If we reach this point, no rule chain passed.
    throw new ValidationError({
      name: 'E_NO_MATCHING_RULE_CHAIN',
      message: 'Expected value to match at least one rule chain in the set.',
      causes,
    })
  } as RuleSet<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { isStringNumber, isUndefined } = await import('./assert')

  describe('rule set from set of functions', () => {
    it('should create a rule set and transform a value', () => {
      const rule = createRuleSet([isStringNumber, Number])
      const result = rule('5')
      expect(result).toBe(5)
      expectTypeOf(result).toEqualTypeOf<number>()
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number>()
    })

    it('should match the first rule chain', () => {
      const toString = vi.fn(String) as (value: unknown) => string
      const toNumber = vi.fn(Number) as (value: unknown) => number
      const rule = createRuleSet([toNumber], [toString])
      const result = rule('5')
      expect(result).toBe(5)
      expect(toNumber).toHaveBeenCalledWith('5')
      expect(toString).not.toHaveBeenCalled()
      expectTypeOf(result).toEqualTypeOf<number | string>()
    })

    it('should match undefined if the value is not a number', () => {
      const rule = createRuleSet([isStringNumber, Number], [isUndefined])
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = rule(undefined)
      expect(result).toBeUndefined()
      expectTypeOf(result).toEqualTypeOf<number | undefined>()
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => number | undefined>()
    })

    it('should match the second rule chain if the first rule chain fails', () => {
      const throws = vi.fn(isUndefined) as typeof isUndefined
      const toString = vi.fn(String) as (value: unknown) => string
      const rule = createRuleSet([throws], [toString])
      const result = rule(5)
      expect(result).toBe('5')
      expect(throws).toHaveBeenCalledWith(5)
      expect(toString).toHaveBeenCalledWith(5)
      expectTypeOf(result).toEqualTypeOf<string | undefined>()
      expectTypeOf(rule).toEqualTypeOf<(value: unknown) => string | undefined>()
    })

    it('should throw an error if no rule chain passes', () => {
      const throws = vi.fn(isUndefined)
      const rule = createRuleSet([throws], [throws])
      const shouldThrow = () => rule(5)
      expect(shouldThrow).toThrow(ValidationError)
      expect(shouldThrow).toThrow('Expected value to match at least one rule chain in the set.')
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
}
