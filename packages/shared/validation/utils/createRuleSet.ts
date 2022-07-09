import { ValidationRule, ValidationRulePipe, ValidationRuleSet } from '../types'
import { isRule } from './isRule'

/**
 * Converts a rule, array of rule or rule set to a rule set.
 * @param {ValidationRuleSet} ruleSet The rule set to convert
 * @returns {ValidationRuleSet} The rule set
 * @throws {TypeError} If the rule set is not valid
 * @example
 * const ruleSet = createRuleSet(Number.isNaN) // [[Number.isNaN]]
 */
export const createRuleSet = (ruleSet: ValidationRule | ValidationRulePipe | ValidationRuleSet): ValidationRuleSet => {
  // --- is rule set as array
  if (Array.isArray(ruleSet)) {
    // @ts-expect-error: ignore
    if (ruleSet.every(x => Array.isArray(x) && x.every(isRule))) return ruleSet
    // @ts-expect-error: ignore
    if (ruleSet.every(isRule)) return [ruleSet]
  }

  // --- Is a single rule as rule set
  if (isRule(ruleSet)) return [[ruleSet]]

  // --- Is not a ruleSet
  throw new TypeError(`Invalid rule set: ${ruleSet}`)
}
