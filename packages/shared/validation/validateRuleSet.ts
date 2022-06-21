import { isRule } from './isRule'
import { validateRules } from './validateRules'
import { ValidateRulesResult, ValidationRule, ValidationRuleSet } from './types'

/**
 * Validate a value against a ValidationRuleSet.
 * @param {any} value The value to validate
 * @param {ValidationRuleSet} ruleSets The ValidationRuleSet to validate against
 * @param {any} context A context to pass through to the validation rules
 * @returns {Promise<ValidateRuleResult>} The result of the validation
 */
export const validateRuleSet = async(value: any, ruleSets: ValidationRuleSet, context?: any): Promise<ValidateRulesResult> => {
  const results: ValidateRulesResult[] = []
  if (isRule(ruleSets)) ruleSets = [[ruleSets]]
  // @ts-expect-error: Is valid.
  else if (ruleSets.every(isRule)) ruleSets = [ruleSets]
  // @ts-expect-error: Is valid.
  else if (!ruleSets.every(x => isRule(x) || x.every(isRule))) throw new Error('invalid rule set')

  // --- Validate and store results of each rules one by one.
  // --- If one of the rules does not return a boolean, use it as new value.
  for (const rules of <ValidationRule[][]>ruleSets) {
    const result = await validateRules(value, rules, context)
    results.push(result)
    if (result.isValid) {
      value = result.value ?? value
      break
    }
  }

  const isValid = results.some(x => x.isValid)
  const isInvalid = !isValid

  // --- Return  result.
  return {
    results: results.flatMap(x => x.results),
    valid: results.flatMap(x => x.valid),
    failed: results.flatMap(x => x.failed),
    errors: results.flatMap(x => x.errors),
    value,
    isValid,
    isInvalid,
  }
}
