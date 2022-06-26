import { MaybeArray } from '../types'
import { isRule } from './isRule'
import { validateRule } from './validateRule'
import { ValidateRuleResult, ValidateRulesResult, ValidationRule } from './types'

/**
 * Validate a list of rules and return the result
 * @param {any} value The value to validate
 * @param {MaybeArray<ValidationRule>} rules The rules to validate againt
 * @param {any} context An optional context to pass to the rules
 * @returns {Promise<ValidateRulesResult>} The validation result
 */
export const validateRules = async(value: any, rules: MaybeArray<ValidationRule>, context?: any): Promise<ValidateRulesResult> => {
  const results: ValidateRuleResult[] = []
  rules = isRule(rules) ? [rules] : rules

  // --- Validate and store results of each rules one by one.
  // --- If one of the rules does not return a string, use it as new value.
  for (const rule of rules) {
    const result = await validateRule(value, rule, context)
    value = result.value ?? value
    results.push(result)
    if (!result.isValid) break
  }

  // --- Return  result.
  return {
    value,
    results,
    valid: results.filter(x => x.isValid).map(x => x.name),
    failed: results.filter(x => !x.isValid).map(x => x.name),
    errors: results.filter(x => !x.isValid).flatMap(x => x.errorMessage ?? x.name).filter(Boolean),
    isValid: results.every(x => x.isValid),
  }
}
