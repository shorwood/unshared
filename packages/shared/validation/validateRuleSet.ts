import { validateRulePipe } from './validateRulePipe'
import { ValidateRulePipeResult, ValidateRuleSetResult, ValidationRule, ValidationRulePipe, ValidationRuleSet } from './types'
import { createRuleSet } from './utils/createRuleSet'

/**
 * Validate a value against a ValidationRuleSet.
 * @param {any} value The value to validate
 * @param {ValidationRuleSet} ruleSet The ValidationRuleSet to validate against
 * @param {Record<string, any>} context A context to pass through to the validation rules
 * @returns {Promise<ValidateRuleResult>} The result of the validation
 */
export const validateRuleSet = async(value: any, ruleSet: ValidationRule | ValidationRulePipe | ValidationRuleSet, context?: Record<string, any>): Promise<ValidateRuleSetResult> => {
  const results: ValidateRulePipeResult[] = []

  // --- Make sure it's a set of rules.
  ruleSet = createRuleSet(ruleSet)

  // --- Validate and store results of each rules one by one.
  for (const rules of ruleSet) {
    const result = await validateRulePipe(value, rules, context)
    results.push(result)
    if (result.isValid) break
  }

  // --- Compute isValid state.
  const isValid = results.some(x => x.isValid)

  // --- Return  result.
  return {
    results: results.flatMap(x => x.results),
    valid: results.flatMap(x => x.valid),
    failed: results.flatMap(x => x.failed),
    error: !isValid ? results.find(x => !x.isValid)?.error : undefined,
    value: results.find(x => x.isValid)?.value ?? value,
    isValid,
  }
}
