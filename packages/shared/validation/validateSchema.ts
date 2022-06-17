import { mapValues } from '../collection'
import { validateRuleSet } from './validateRuleSet'
import { ValidateSchemaResult, ValidationSchema } from './types'

export const validateSchema = async(object?: any, schema?: ValidationSchema, context?: any): Promise<ValidateSchemaResult> => {
  if (!object || !schema) {
    return {
      results: {},
      valid: {},
      failed: {},
      errors: {},
      value: object,
      isValid: true,
      isInvalid: false,
    }
  }

  // --- Validate rule sets for every fields.
  const results: ValidateSchemaResult['results'] = {}
  for (const key in schema) {
    const value = object[key]
    const ruleSets = schema[key]
    results[key] = await validateRuleSet(value, ruleSets, { ...object, ...context })
  }

  return {
    results,
    failed: mapValues(results, x => x.failed),
    valid: mapValues(results, x => x.valid),
    errors: mapValues(results, x => x.errors),
    value: { ...object, ...mapValues(results, x => x.value) },
    isValid: Object.entries(results).every(([,result]) => (<any>result).isValid),
    isInvalid: !Object.entries(results).every(([,result]) => (<any>result).isValid),
  }
}
