import { mapValues } from '../collection/mapValues'
import { ValidationRuleSet, ValidationSchema } from './types'
import { validateRuleSet } from './validateRuleSet'

/**
 * Transform a `ValidationRuleSet` into a `vee-validate` validation rule.
 * @param {ValidationRuleSet} ruleSet The validation rules to transform.
 * @param {any} [context] The context to provide to the validation rules.
 * @returns A validation function that can be used with `vee-validate`.
 */
export const createVeeValidator = (ruleSet: ValidationRuleSet, context?: any) => async(value: any) => {
  const { isValid, errors } = await validateRuleSet(value, ruleSet, context)
  return isValid ? true : errors?.[0]
}

/**
 * Transform a `ValidationRuleSet` into a `vee-validate` validation rule.
 * @param {ValidationSchema} schema The validation schema to transform.
 * @param {any} [context] The context to provide to the validation rules.
 * @returns A validation schema that can be used with `vee-validate`.
 */
export const createVeeSchema = (schema: ValidationSchema, context?: any) =>
  mapValues(schema, rules => createVeeValidator(rules, context))
