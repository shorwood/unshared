import { validateRuleSet } from './validateRuleSet'
import { ValidationRuleSet } from './types'

/**
 * Check if value is an array
 * @param {any} value The value to check
 * @returns {boolean} True if value is an array
 */
export const isArray = (value: any): value is any[] => Array.isArray(value)

/**
  * Check if an array is empty
  * @param {any[]} array The array to check
  * @returns {boolean} True if array is an empty array
  */
export const isArrayEmpty = (array: any[]): boolean => Array.isArray(array) && array.length === 0

/**
  * Check if an array is not empty
  * @param {any[]} array The array to check
  * @returns {boolean} True if array is a non empty array
  */
export const isArrayNotEmpty = (array: any[]): boolean => Array.isArray(array) && array.length > 0

/**
  * Check if an array includes item
  * @param {any[]} array The array to check
  * @param {any} item The array to look for
  * @returns {boolean} True if array includes item
  */
export const isArrayIncluding = <T>(array: T[], item: T): boolean => array.includes(item)

/**
  * Check if an array includes at least one of the items
  * @param {any[]} array The array to check
  * @param {any[]} items The values to look for
  * @returns {boolean} True if array includes at least one of the items
  */
export const isArrayIncludingSome = <T>(array: T[], items: T[]): boolean => items.some(item => array.includes(item))

/**
   * Check if an array includes all of the items
   * @param {any[]} array The array to check
   * @param {any[]} items The values to look for
   * @returns {boolean} True if array includes all of the items
   */
export const isArrayIncludingEvery = <T>(array: T[], items: T[]): boolean => items.every(item => array.includes(item))

/**
  * Check if an array does not include item
  * @param {any[]} array The array to check
  * @param {any} item The array to look for
  * @returns {boolean} True if array does not include itemobject
  */
export const isArrayNotIncluding = <T>(array: T[], item: T): boolean => !array.includes(item)

/**
   * Check if an array does not include some of the items
   * @param {any[]} array The array to check
   * @param {any[]} items The values to look for
   * @returns {boolean} True if array does not include any of the items
   */
export const isArrayNotIncludingSome = <T>(array: T[], items: T[]): boolean => items.some(item => !array.includes(item))

/**
   * Check if an array does not include all of the items
   * @param {any[]} array The array to check
   * @param {any[]} items The values to look for
   * @returns {boolean} True if array does not include all of the items
   */
export const isArrayNotIncludingEvery = <T>(array: T[], items: T[]): boolean => items.every(item => !array.includes(item))

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
