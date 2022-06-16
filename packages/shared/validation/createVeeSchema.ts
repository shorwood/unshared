import { mapValues } from '../collection'
import { createVeeValidator } from './createVeeValidator'
import { ValidationSchema } from './types'

/**
 *
 * @param schema
 * @param context
 */
export const createVeeSchema = (schema: ValidationSchema, context?: any) => (
  mapValues(schema, rules => createVeeValidator(rules, context))
)
