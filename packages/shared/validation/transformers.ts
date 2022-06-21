/* eslint-disable unicorn/no-null */
import { get } from '../collection'

/**
 * Check if value is equal to expected
 * @param {any} expected The expected value
 * @param {any} value The actual value
 * @returns {boolean} True if the value is equal to the expected value
 */
export const isEqualToValue = (value: any, expected: any): boolean => value === expected

/**
  * Check if a value in the context is equal to an expected value
  * @param {any} expected The expected value
  * @param {string} path The path to the value in the context
  * @param {any} context The context
  * @returns {boolean} True if the value at the path is equal to the expected value
  */
export const isEqualToContext = (expected: any, path: string, context: any): boolean => expected === get(context, path)

/**
  * Get the default value if the value is undefined
  * @param {any} value The value to check
  * @param {any} defaultValue The value to return if the value is undefined
  * @returns {any} The default value if the value is undefined, the value otherwise
  */
export const defaultToValue = (value: any, defaultValue: any): any => (value !== undefined ? false : defaultValue)

/**
  * Get the default value from the context if the value is undefined
  * @param {any} value The value to check
  * @param {string} path The path to the default value
  * @param {any} context The context
  * @returns {any} The default value if the value is undefined, the value otherwise
  */
export const defaultToContext = (value: any, path: string, context: any): any => (value !== undefined ? false : get(context, path))

/**
  * Get the default values from the context if the value is undefined
  * @param {any} value The value to check
  * @param {string[]} paths The paths to the default values
  * @param {any} context The context
  * @returns {any[]} The default values if the value is undefined, the value otherwise
  */
export const defaultToContexts = (value: any, paths: string[], context: any): false | any[] => (value !== undefined ? false : paths.map(path => get(context, path)))

/**
  * @returns {null}
  */
export const toNull = (): null => null

/**
  * @returns {undefined}
  */
export const toUndefined = (): undefined => undefined

/**
  * @param {any} _ Ignored
  * @param {any} newValue The new value
  * @returns {any} The new value
  */
export const toValue = (_: any, newValue: any): any => newValue

/**
  * Get a value from the context
  * @param {any} _ Ignored
  * @param {string} path The path to the value in the context
  * @param {any} context The context
  * @returns {any} The value at the given path in the context
  */
export const toContext = (_: any, path: string, context: any): any => get(context, path)

/**
  * Get values from the context
  * @param {any} _ Ignored
  * @param {string[]} paths The paths to the values in the context
  * @param {any} context The context
  * @returns {any[]} The values at the given paths in the context
  */
export const toContexts = (_: any, paths: string[], context: any): any[] => paths.map(path => get(context, path))
