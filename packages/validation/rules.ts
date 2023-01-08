/* eslint-disable no-new-wrappers */
/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable unicorn/no-null */
import { get } from '@unshared-dev/collection/get'
import { ValidationRuleSet, ValidationSchema } from './types'
import { validateRuleSet } from './validateRuleSet'
import { validateSchema } from './validateSchema'

/**
 * Check if an object passes a validation schema
 * @param object The object to check
 * @param schema The validation schema
 * @return True if the object passes a validation schema
 */
export const isObjectValid = async(object: Record<string, any>, schema: ValidationSchema): Promise<boolean> => {
  const result = await validateSchema(object, schema)
  return result.isValid
}

/**
 * Check if every items of an array passes a validation rule set
 * @param array The array to check
 * @param ruleSet The validation rule set
 * @return True if every items of the array passes the validation rule set
 */
export const isArrayValid = async(array: any[], ruleSet: ValidationRuleSet): Promise<boolean> => {
  const promises = array.map(item => validateRuleSet(item, ruleSet))
  const results = await Promise.all(promises)
  return results.every(result => result.isValid)
}

/**
 * Check if value is equal to expected
 * @param expected The expected value
 * @param value The actual value
 * @return True if the value is equal to the expected value
 */
export const isEqualToValue = (value: any, expected: any): boolean => value === expected

/**
  * Check if a value in the context is equal to a value
  * @param value The value
  * @param path The path to the context value
  * @return `true` if the value is equal to the value in the context
  */
export const isEqualToContext = function(this: any, value: any, path: string): boolean { return value === get(this, path) }

/**
  * @param _ Ignored
  * @param newValue The new value
  * @return The new value
  */
export const toValue = (_: any, newValue: any): any => newValue

/**
  * Get a value from the context
  * @param value Ignored
  * @param path The path to the value in the context
  * @param defaultValue The default value if the value is not found
  * @return The value at the given path in the context
  */
export const toContext = function(this: any, value: any, path: string, defaultValue: any): any { return get(this, path, defaultValue) }

/**
  * @return `null`
  */
export const toNull = (): null => null

/**
  * @return `undefined`
  */
export const toUndefined = (): undefined => undefined

/**
  * @return `[]` -  An empty array
  */
export const toEmptyArray = (): any[] => []

/**
  * @return `''` - An empty string
  */
export const toEmptyString = (): string => ''

/**
 * @return `Boolean(true)` - A boolean object with a value of `true`
 */
export const toTrue = (): Boolean => new Boolean(true)

/**
 * @return `Boolean(false)` - A boolean object with a value of `false`
 */
export const toFalse = (): Boolean => new Boolean(false)
