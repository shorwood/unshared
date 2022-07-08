import { ValidationRuleSet } from './types'
import { validateRuleSet } from './validateRuleSet'

/**
 * Check if every items of an array passes a validation rule set
 * @param {any[]} array The array to check
 * @param {ValidationRuleSet} ruleSet The validation rule set
 * @returns {Promise<boolean>} True if every items of the array passes the validation rule set
 */
export const isArrayValid = async(array: any[], ruleSet: ValidationRuleSet): Promise<boolean> => {
  const promises = array.map(item => validateRuleSet(item, ruleSet))
  const results = await Promise.all(promises)
  return results.every(result => result.isValid)
}
