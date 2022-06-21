import { mapValues } from '../collection'
import { validateRuleSet } from './validateRuleSet'
import { ValidateSchemaResult, ValidationSchema } from './types'

/**
 * Validate an object against a validation schema.
 * @param {Record<string, any>} object The object to validate
 * @param {ValidationSchema} schema The validation schema
 * @param {any} context The context to use for validation
 * @returns {Promise<ValidateSchemaResult>} A promise resolving to the validation result
 */
export const validateSchema = async(object: any, schema: ValidationSchema, context?: any): Promise<ValidateSchemaResult> => {
  // --- Validate rule sets for every fields.
  const results: ValidateSchemaResult['results'] = {}
  for (const key in schema) {
    const value = object[key]
    const ruleSets = schema[key]
    results[key] = await validateRuleSet(value, ruleSets, { ...object, ...context })
  }

  // --- Return results.
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
