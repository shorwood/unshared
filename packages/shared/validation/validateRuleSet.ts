import { isRule } from './isRule'
import { validateRules } from './validateRules'
import { Rule, RuleSet, ValidateRulesResult } from './types'

/**
 *
 * @param value
 * @param ruleSets
 * @param context
 */
export const validateRuleSet = async(value: any, ruleSets: RuleSet, context?: any): Promise<ValidateRulesResult> => {
  const results: ValidateRulesResult[] = []
  if (isRule(ruleSets)) ruleSets = [[ruleSets]]
  // @ts-expect-error: Is valid.
  else if (ruleSets.every(isRule)) ruleSets = [ruleSets]
  // @ts-expect-error: Is valid.
  else if (!ruleSets.every(x => isRule(x) || x.every(isRule))) throw new Error('invalid rule set')

  // --- Validate and store results of each rules one by one.
  // --- If one of the rules does not return a string, use it as new value.
  for (const rules of <Rule[][]>ruleSets) {
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
    failed: isInvalid ? results.flatMap(x => x.failed) : [],
    valid: isInvalid ? results.flatMap(x => x.valid) : [],
    errors: isInvalid ? results.flatMap(x => x.errors) : [],
    value,
    isValid,
    isInvalid,
  }
}
