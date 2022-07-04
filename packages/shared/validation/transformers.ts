/* eslint-disable unicorn/no-null */
import { get } from '../collection/get'

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
