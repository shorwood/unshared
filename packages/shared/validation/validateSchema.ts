import { mapValues } from '../collection/mapValues'
import { validateRuleSet } from './validateRuleSet'
import { ValidateSchemaResult, ValidationSchema } from './types'

/**
 * Validate an object against a validation schema.
 * @param object The object to validate
 * @param schema The validation schema
 * @param context The context to use for validation
 * @return A promise resolving to the validation result
 */
export const validateSchema = async(object: any, schema: ValidationSchema, context?: Record<string, any>): Promise<ValidateSchemaResult> => {
  // --- Validate rule sets for every fields.
  const results: ValidateSchemaResult['results'] = {}
  for (const key in schema) {
    const value = object[key]
    const ruleSets = schema[key]
    results[key] = await validateRuleSet(value, ruleSets, context)
  }

  // --- Return results.
  return {
    results,
    failed: mapValues(results, x => x.failed),
    valid: mapValues(results, x => x.valid),
    errors: mapValues(results, x => x.error),
    value: { ...object, ...mapValues(results, x => x.value) },
    isValid: Object.values(results).every(result => (<any>result).isValid),
    areValid: mapValues(results, x => x.isValid),
  }
}
