import { mapValues } from '../collection'
import { createVeeValidator } from './createVeeValidator'
import { Schema } from './types'

/**
 *
 * @param schema
 * @param context
 */
export const createVeeSchema = (schema: Schema, context?: any) => (
  mapValues(schema, rules => createVeeValidator(rules, context))
)
