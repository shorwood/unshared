/* eslint-disable no-new-wrappers */
/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable unicorn/no-null */
import { get } from '../collection/get'
import { ValidationRuleSet, ValidationSchema } from './types'
import { validateRuleSet } from './validateRuleSet'
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

/**
 * Check if every items of an array passes a validation rule set
 * @param {any[]} array The array to check
 * @param {ValidationRuleSet} ruleSet The validation rule set
 * @returns {Promise<boolean>} True if every items of the array passes the validation rule set
 */
export const isArrayValid = async(array: any[], ruleSet: ValidationRuleSet): Promise<boolean> => {
  const promises = array.map(item => validateRuleSet(item, ruleSet))
  const results = await Promise.all(promises)
  return results.every(result => result.isValid)
}

/**
 * Check if value is equal to expected
 * @param {any} expected The expected value
 * @param {any} value The actual value
 * @returns {boolean} True if the value is equal to the expected value
 */
export const isEqualToValue = (value: any, expected: any): boolean => value === expected

/**
  * Check if a value in the context is equal to a value
  * @param {any} value The value
  * @param {string} path The path to the context value
  * @returns {boolean} `true` if the value is equal to the value in the context
  */
export const isEqualToContext = function(this: any, value: any, path: string): boolean { return value === get(this, path) }

/**
  * @param {any} _ Ignored
  * @param {any} newValue The new value
  * @returns {any} The new value
  */
export const toValue = (_: any, newValue: any): any => newValue

/**
  * Get a value from the context
  * @param {any} value Ignored
  * @param {string} path The path to the value in the context
  * @param {any} defaultValue The default value if the value is not found
  * @returns {any} The value at the given path in the context
  */
export const toContext = function(this: any, value: any, path: string, defaultValue: any): any { return get(this, path, defaultValue) }

/**
  * @returns {null} `null`
  */
export const toNull = (): null => null

/**
  * @returns {undefined} `undefined`
  */
export const toUndefined = (): undefined => undefined

/**
  * @returns {[]} `[]` -  An empty array
  */
export const toEmptyArray = (): any[] => []

/**
  * @returns {''} `''` - An empty string
  */
export const toEmptyString = (): string => ''

/**
 * @returns {Boolean} `Boolean(true)` - A boolean object with a value of `true`
 */
export const toTrue = (): Boolean => new Boolean(true)

/**
 * @returns {Boolean} `Boolean(false)` - A boolean object with a value of `false`
 */
export const toFalse = (): Boolean => new Boolean(false)
