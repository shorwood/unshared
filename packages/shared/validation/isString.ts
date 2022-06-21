/**
 * Check if value is a string
 * @param {string} value The value to check
 * @returns {value is string} True if string, false otherwise
 */
export const isString = (value: any): value is string => typeof value === 'string'

/**
  * Check if the string is empty
  * @param {string} value The value to check
  * @returns {boolean} True if string is empty, false otherwise
  */
export const isStringEmpty = (value: string): boolean => value.trim().length === 0

/**
  * Check if the string is not empty
  * @param {string} value The value to check
  * @returns {boolean} True if string is not empty, false otherwise
  */
export const isStringNotEmpty = (value: string): boolean => value.trim().length > 0

/**
  * Check if the string starts with substr
  * @param {string} value The value to check
  * @param {string} substr The substring to look for
  * @returns {boolean} True if string starts with substr, false otherwise
  */
export const isStringStartingWith = (value: string, substr: string): boolean => value.startsWith(substr)

/**
  * Check if the string ends with substr
  * @param {string} value The value to check
  * @param {string} substr The substring to look for
  * @returns {boolean} True if string ends with substr, false otherwise
  */
export const isStringEndingWith = (value: string, substr: string): boolean => value.endsWith(substr)

/**
  * Check if the string is longer than length
  * @param {string} value The value to check
  * @param {number} length The length to compare to
  * @returns {boolean} True if string is longer than length, false otherwise
  */
export const isStringLonger = (value: string, length: number): boolean => value.length > length

/**
  * Check if the string is as long or longer than length
  * @param {string} value The value to check
  * @param {number} length The length to compare to
  * @returns {boolean} True if string is as long or longer than length, false otherwise
  */
export const isStringLongerOrEq = (value: string, length: number): boolean => value.length >= length

/**
  * Check if the string is shorter than length
  * @param {string} value The value to check
  * @param {number} length The length to compare to
  * @returns {boolean} True if string is shorter than length, false otherwise
  */
export const isStringShorter = (value: string, length: number): boolean => value.length < length

/**
  * Check if the string is as short or shorter than length
  * @param {string} value The value to check
  * @param {number} length The length to compare to
  * @returns {boolean} True if string is as short or shorter than length, false otherwise
  */
export const isStringShorterOrEq = (value: string, length: number): boolean => value.length <= length

/**
  * Check if the string's length is between min and max
  * @param {string} value The value to check
  * @param {{ min: number; max: number }} minmax The minimum and maximim length
  * @returns {boolean} True if string's length is between min and max, false otherwise
  */
export const isStringBetween = (value: string, { min, max }: { min: number; max: number }): boolean => value.length > min && value.length < max

/**
  * Check if the string's length is between or equal to min and max
  * @param {string} value The value to check
  * @param {{ min: number; max: number }} minmax The minimum and maximim length
  * @returns {boolean} True if string's length is between or equal to min and max, false otherwise
  */
export const isStringBetweenOrEq = (value: string, { min, max }: { min: number; max: number }): boolean => value.length >= min && value.length <= max
