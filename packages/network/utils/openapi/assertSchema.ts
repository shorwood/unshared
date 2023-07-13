/* eslint-disable sonarjs/cognitive-complexity */
import { OpenAPIV3 } from 'openapi-types'
import { ResolvedDeep } from './resolveDocument'

/**
 * Asserts that a value is valid according to an OpenAPI schema. This function
 * will throw a `TypeError` if the value is invalid.
 *
 * @param value The value to validate.
 * @param schema The OpenAPI schema.
 * @throws TypeError if the value is invalid.
 * @example assertSchema('1', { type: 'number' }) // TypeError
 */
export function assertSchema(value: unknown, schema: ResolvedDeep<OpenAPIV3.SchemaObject>): void {
  const name = schema.title ? `'${schema.title}'` : 'value'

  // --- If required, assert that the value is defined.
  if (value === undefined) {
    if (!schema.required) return
    throw new TypeError(`Expected ${name} to be defined.`)
  }

  // --- If null, assert that the value is nullable.
  if (value === null) {
    if (schema.nullable) return
    throw new TypeError(`Expected ${name} to be nullable.`)
  }

  // --- Assert the string type.
  if (schema.type === 'string') {
    if (typeof value !== 'string')
      throw new TypeError(`Expected ${name} to be a string.`)
    if (schema.minLength !== undefined && value.length < schema.minLength)
      throw new TypeError(`Expected ${name} to be at least ${schema.minLength} characters long.`)
    if (schema.maxLength !== undefined && value.length > schema.maxLength)
      throw new TypeError(`Expected ${name} to be at most ${schema.maxLength} characters long.`)
    if (schema.pattern !== undefined && !new RegExp(schema.pattern).test(value))
      throw new TypeError(`Expected ${name} to match the pattern ${schema.pattern}.`)
    if (schema.enum !== undefined && !schema.enum.includes(value))
      throw new TypeError(`Expected ${name} to be one of ${schema.enum.join(', ')}.`)
    return
  }

  // --- Assert the number type.
  if (schema.type === 'number') {
    if (typeof value !== 'number')
      throw new TypeError(`Expected ${name} to be a number.`)
    if (schema.minimum !== undefined && schema.exclusiveMinimum ? value <= schema.minimum : value < schema.minimum!)
      throw new TypeError(`Expected ${name} to be at least ${schema.minimum}.`)
    if (schema.maximum !== undefined && schema.exclusiveMaximum ? value >= schema.maximum : value > schema.maximum!)
      throw new TypeError(`Expected ${name} to be at most ${schema.maximum}.`)
    if (schema.multipleOf !== undefined && value % schema.multipleOf !== 0)
      throw new TypeError(`Expected ${name} to be a multiple of ${schema.multipleOf}.`)
    if (schema.enum !== undefined && !schema.enum.includes(value))
      throw new TypeError(`Expected ${name} to be one of ${schema.enum.join(', ')}.`)
    return
  }

  // --- Recursively assert the properties of the value.
  if (schema.type === 'object') {
    if (typeof value !== 'object' || value === null)
      throw new TypeError(`Expected ${name} to be an object.`)
    if (schema.minProperties !== undefined && Object.keys(value).length < schema.minProperties)
      throw new TypeError(`Expected ${name} to have at least ${schema.minProperties} properties.`)
    if (schema.maxProperties !== undefined && Object.keys(value).length > schema.maxProperties)
      throw new TypeError(`Expected ${name} to have at most ${schema.maxProperties} properties.`)
    return
  }

  // --- Recursively assert the items of the value.
  if (schema.type === 'array') {
    if (!Array.isArray(value))
      throw new TypeError(`Expected ${name} to be an array.`)
    if (schema.minItems !== undefined && value.length < schema.minItems)
      throw new TypeError(`Expected ${name} to have at least ${schema.minItems} items.`)
    if (schema.maxItems !== undefined && value.length > schema.maxItems)
      throw new TypeError(`Expected ${name} to have at most ${schema.maxItems} items.`)
  }
}
