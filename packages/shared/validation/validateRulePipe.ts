import { validateRule } from './validateRule'
import { ValidateRulePipeResult, ValidateRuleResult, ValidationRule, ValidationRulePipe } from './types'
import { createRulePipe } from './utils/createRulePipe'

/**
 * Validate a list of rules and return the result
 * @param {any} value The value to validate
 * @param {ValidationRule | ValidationRulePipe} rulePipe The rules to validate againt
 * @param {Record<string, any>} context An optional context to pass to the rules
 * @returns {Promise<ValidateRulePipeResult>} The validation result
 */
export const validateRulePipe = async(value: any, rulePipe: ValidationRule | ValidationRulePipe, context?: Record<string, any>): Promise<ValidateRulePipeResult> => {
  const results: ValidateRuleResult[] = []

  // --- Make sure it's a list of rules.
  rulePipe = createRulePipe(rulePipe)

  // --- Validate and store results of each rules one by one.
  // --- If one of the rules does not return a string, use it as new value.
  for (const rule of <any>rulePipe) {
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
    error: results.find(x => !x.isValid)?.error,
    isValid: results.every(x => x.isValid),
  }
}
