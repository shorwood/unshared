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
  const compiled = rules.map(rule => createRule(rule))
  return function(this: unknown, value: unknown) {
    for (const rule of compiled) value = rule.call(this, value)
    return value
  } as RuleChain<T>
}
