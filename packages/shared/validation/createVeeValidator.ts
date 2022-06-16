import { ValidationRuleSet } from './types'
import { validateRuleSet } from './validateRuleSet'

/**
 *
 * @param ruleSet
 * @param context
 */
export const createVeeValidator = (ruleSet: ValidationRuleSet, context?: any) => async(value: any) => {
  const { isValid, errors } = await validateRuleSet(value, ruleSet, context)
  return isValid ? true : errors?.[0]
}
