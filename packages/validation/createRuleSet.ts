import type { Immutable } from '@unshared/types'
import type { RuleLike } from './createRule'
import type { RuleChainLike, RuleChainResult } from './createRuleChain'
import { createAssertionError } from './createAssertionError'
import { createRuleChain } from './createRuleChain'

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
 * @example createRuleSet([isStringNumber, Number.parseInt], [isNumber]) // (value: unknown) => number
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
    throw createAssertionError({
      name: 'E_RULE_SET_ASSERTION_FAILED',
      message: 'No rule set passed.',
      context: { causes },
    })
  } as RuleSet<T>
}
