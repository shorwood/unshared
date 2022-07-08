import { ValidationSchema } from './types'
import { validateSchema } from './validateSchema'

/**
 * Check if an object passes a validation schema
 * @param {Record<string, any>} object The object to check
 * @param {ValidationSchema} schema The validation schema
 * @returns {Promise<boolean>} True if the object passes a validation schema
 */
export const isObjectValid = async(object: Record<string, any>, schema: ValidationSchema): Promise<boolean> => {
  const result = await validateSchema(object, schema)
  return result.isValid
}
