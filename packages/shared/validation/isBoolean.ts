/**
 * Check if value is a boolean
 * @param value The value to check
 * @returns {value is boolean} `true` if value is a boolean, `false` otherwise
 */
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'

/**
 * Check if value is truthy
 * @param value The value to check
 * @returns {boolean} `true` if value is truthy, `false` otherwise
 */
export const isTruthy = (value: any): boolean => !!value

/**
 * Check if value is falsy
 * @param value The value to check
 * @returns {boolean} `true` if value is falsy, `false` otherwise
 */
export const isFalsy = (value: any): boolean => !value

/**
 * Check if value is true
 * @param {boolean} value The value to check
 * @returns {value is true} `true` if value is true, `false` otherwise
 */
export const isTrue = (value: boolean): value is true => value === true

/**
 * Check if value is false
 * @param {boolean} value The value to check
 * @returns {value is false} `true` if value is false, `false` otherwise
 */
export const isFalse = (value: boolean): value is false => value === false
