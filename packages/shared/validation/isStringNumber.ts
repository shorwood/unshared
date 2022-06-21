/**
  * Check if the string can be converted to a number
  * @param {string} value The value to check
  * @returns {boolean} True if string can be converted to a number, false otherwise
  */
export const isStringNumber = (value: string): boolean => !Number.isNaN(Number(value))

/**
   * Check if the string is a can be converted to an integer
   * @param {string} value The value to check
   * @returns {boolean} True if string can be converted to an integer, false otherwise
   */
export const isStringInteger = (value: string): boolean => /^-?\d+$/.test(value)

/**
   * Check if the string is a can be converted to a positive integer
   * @param {string} value The value to check
   * @returns {boolean} True if string can be converted to a positive integer, false otherwise
   */
export const isStringIntegerPositive = (value: string): boolean => /^\d+$/.test(value)

/**
   * Check if the string is a can be converted to a negative integer
   * @param {string} value The value to check
   * @returns {boolean} True if string can be converted to a negative integer, false otherwise
   */
export const isStringIntegerNegative = (value: string): boolean => /^-\d+$/.test(value)

/**
   * Check if the string is a can be converted to a float
   * @param {string} value The value to check
   * @returns {boolean} True if string can be converted to a float, false otherwise
   */
export const isStringFloat = (value: string): boolean => /^-?\d+(\.\d+)?$/.test(value)

/**
   * Check if the string is a can be converted to a positive float
   * @param {string} value The value to check
   * @returns {boolean} True if string can be converted to a positive float, false otherwise
   */
export const isStringFloatPositive = (value: string): boolean => /^\d+(\.\d+)?$/.test(value)

/**
   * Check if the string is a can be converted to a negative float
   * @param {string} value The value to check
   * @returns {boolean} True if string can be converted to a negative float, false otherwise
   */
export const isStringFloatNegative = (value: string): boolean => /^-\d+(\.\d+)?$/.test(value)
