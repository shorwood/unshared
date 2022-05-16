import { isRule } from './isRule'
import { validateRule } from './validateRule'
import { Rule, ValidateRuleResult, ValidateRulesResult } from './types'

/**
 *
 * @param value
 * @param rules
 * @param context
 */
export const validateRules = async(value: any, rules: Rule | Rule[], context?: any): Promise<ValidateRulesResult> => {
  const results: ValidateRuleResult[] = []
  rules = isRule(rules) ? [rules] : rules

  // --- Validate and store results of each rules one by one.
  // --- If one of the rules does not return a string, use it as new value.
  for (const rule of rules) {
    const result = await validateRule(value, rule, context)
    value = result.value ?? value
    results.push(result)
    if (!result.isValid)
      break
  }

  // --- Return  result.
  return {
    value,
    results,
    valid: results.filter(x => x.isValid).map(x => x.name),
    failed: results.filter(x => !x.isValid).map(x => x.name),
    errors: results.filter(x => !x.isValid).map(x => x.errorMessage ?? `rule "${x.name}" failed with value "${x.value}"`).filter(Boolean),
    isValid: results.every(x => x.isValid),
    isInvalid: !results.every(x => x.isValid),
  }
}
