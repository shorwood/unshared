/* eslint-disable unicorn/no-useless-undefined */
import type { Immutable } from '@unshared/types'
import type { RuleLike } from './createRule'
import type { RuleChainLike, RuleChainResult } from './createRuleChain'
import { createRuleChain } from './createRuleChain'
import { ValidationError } from './createValidationError'

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

    // --- If we reach this point, no rule chain passed. If so, throw the last error
    // --- that was caught, or throw a new validation error if no errors were caught.
    throw new ValidationError({
      name: 'E_RULE_SET_MISMATCH',
      message: 'No rule set passed.',
      context: { causes },
    })
  } as RuleSet<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { attempt } = await import('@unshared/functions/attempt')
  const { assertNumber, assertUndefined, assertString } = await import('./assert/index')

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
}
