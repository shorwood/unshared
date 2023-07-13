import { RuleLike } from './createRule'
import { isRule } from './isRule'

/** A list of rules that are executed in order until one fails. */
export type ValidationRulePipe = RuleLike[]

/**
 * Converts a rule or array of rules to a rule pipe.
 *
 * @param rules The rules to convert
 * @returns The rule pipe
 */
export const createRulePipe = (rules: RuleLike | ValidationRulePipe): ValidationRulePipe => {
  // --- If it's a single rule, wrap it in an array
  // @ts-expect-error: ignore
  if (!Array.isArray(rules) || !rules.every(isRule)) return [rules]

  // --- If not, it's already a rule pipe
  // @ts-expect-error: ignore
  return rules
}
