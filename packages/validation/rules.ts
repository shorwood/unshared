/* eslint-disable no-new-wrappers */
/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable unicorn/no-null */
import { get } from '@unshared/collection/get'
import { ValidationRuleSet, ValidationSchema } from './types'
import { validateRuleSet } from './validateRuleSet'
import { validateSchema } from './validateSchema'

/**
 * Check if an object passes a validation schema
 *
 * @param object The object to check
 * @param schema The validation schema
 * @returns True if the object passes a validation schema
 */
export const isObjectValid = async(object: Record<string, any>, schema: ValidationSchema): Promise<boolean> => {
  const result = await validateSchema(object, schema)
  return result.isValid
}

/**
 * Check if every items of an array passes a validation rule set
 *
 * @param array The array to check
 * @param ruleSet The validation rule set
 * @returns True if every items of the array passes the validation rule set
 */
export const isArrayValid = async(array: any[], ruleSet: ValidationRuleSet): Promise<boolean> => {
  const promises = array.map(item => validateRuleSet(item, ruleSet))
  const results = await Promise.all(promises)
  return results.every(result => result.isValid)
}

/**
 * Check if value is equal to expected
 *
 * @param expected The expected value
 * @param value The actual value
 * @returns True if the value is equal to the expected value
 */
export const isEqualToValue = (value: any, expected: any): boolean => value === expected

/**
 * Check if a value in the context is equal to a value
 *
 * @param value The value
 * @param path The path to the context value
 * @returns `true` if the value is equal to the value in the context
 */
export const isEqualToContext = function(this: any, value: any, path: string): boolean { return value === get(this, path) }

/**
 * @param _ Ignored
 * @param newValue The new value
 * @returns The new value
 */
export const toValue = (_: any, newValue: any): any => newValue

/**
 * Get a value from the context
 *
 * @param value Ignored
 * @param path The path to the value in the context
 * @param defaultValue The default value if the value is not found
 * @returns The value at the given path in the context
 */
export const toContext = function(this: any, value: any, path: string, defaultValue: any): any { return get(this, path, defaultValue) }

/**
 * @returns `null`
 */
export const toNull = (): null => null

/**
 * @returns `undefined`
 */
export const toUndefined = (): undefined => undefined

/**
 * @returns `[]` -  An empty array
 */
export const toEmptyArray = (): any[] => []

/**
 * @returns `''` - An empty string
 */
export const toEmptyString = (): string => ''

/**
 * @returns `Boolean(true)` - A boolean object with a value of `true`
 */
export const toTrue = (): Boolean => new Boolean(true)

/**
 * @returns `Boolean(false)` - A boolean object with a value of `false`
 */
export const toFalse = (): Boolean => new Boolean(false)

/** c8 ignore next */
if (import.meta.vitest) {
  const context = { foo: 1, bar: 2 }
  const isString = (value: any) => typeof value === 'string'

  it.each([

    // --- isEqualToContext
    [1, isEqualToContext, 'foo', true],
    [1, isEqualToContext, 'bar', false],

    // --- isEqualToValue
    [1, isEqualToValue, 1, true],
    [1, isEqualToValue, 2, false],

    // --- isArrayValid/isObjectValid
    [['foo', 1], isArrayValid, [isString], false],
    [['foo', 'bar'], isArrayValid, [isString], true],
    [{ a: 'foo', b: 'bar', c: 1 }, isObjectValid, { a: isString, b: [isString], c: [[isString]] }, false],
    [{ a: 'foo', b: 'bar', c: 'baz' }, isObjectValid, { a: isString, b: [isString], c: [[isString]] }, true],

    // --- toContext
    [0, toContext, 'foo', 1],
    [0, toContext, 'bar', 2],
    [0, toContext, 'baz', undefined],

    // --- toEmptyArray
    [undefined, toEmptyArray, undefined, []],
    [undefined, toEmptyString, undefined, ''],
    [undefined, toNull, undefined, null],
    [undefined, toTrue, undefined, new Boolean(true)],
    [undefined, toFalse, undefined, new Boolean(false)],
    [undefined, toUndefined, undefined, undefined],
    [undefined, toValue, 'foo', 'foo'],

  ])('should transform/validate %s to/with %s and return "%s"', async(value, transformer: any, key, expected) => {
    const result = await transformer.bind(context)(value, key)
    expect(result).toEqual(expected)
  })
}
