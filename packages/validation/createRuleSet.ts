import { ValidationRule, ValidationRulePipe, ValidationRuleSet } from '../types'
import { isRule } from './isRule'

/**
 * Converts a rule, array of rule or rule set to a rule set.
 *
 * @param ruleSet The rule set to convert
 * @returns The rule set
 * @throws If the rule set is not valid
 * @example
 * const ruleSet = createRuleSet(Number.isNaN) // [[Number.isNaN]]
 */
export const createRuleSet = (ruleSet: ValidationRule | ValidationRulePipe | ValidationRuleSet): ValidationRuleSet => {
  // --- Might already be a RuleSet or a RulePipeline
  if (Array.isArray(ruleSet)) {
    // --- Is a RuleSet
    if (ruleSet.every(x => Array.isArray(x) && x.every(isRule))) return ruleSet

    // --- Is a RulePipeline, convert to RuleSet
    if (ruleSet.every(isRule)) return [ruleSet]
  }

  // --- Is a single rule, convert to RuleSet
  if (isRule(ruleSet)) return [[ruleSet]]

  // --- Is not a ruleSet
  throw new TypeError(`Invalid rule set: ${ruleSet}`)
}
