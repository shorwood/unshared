import { ValidationRuleSet } from './types'
import { validateRuleSet } from './validateRuleSet'

/**
 * Instantiate a validator to validate a value against a validation rule set.
 * @param {ValidationRuleSet} ruleSet The validation rule set to use.
 * @param {Record<string, any>} [defaultContext] The default context to provide to the validation rules.
 * @returns A validation function that can be used with `vee-validate`.
 * @example
 * const validator = createValidator([Number.isNaN])
 * await validator(NaN) // true
 * await validator(1) // 'Failed rule: isNaN'
 */
export const createValidator = (ruleSet: ValidationRuleSet, defaultContext?: Record<string, any>) => async(value?: any, context?: Record<string, any>) => {
  const { isValid, error } = await validateRuleSet(value, ruleSet, { ...defaultContext, ...context })
  return isValid ? true : error?.message
}
