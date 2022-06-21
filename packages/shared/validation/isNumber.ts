/**
 * Check if value is a valid number
 * @param {any} value The value to check
 * @returns {value is number} True if value is a number
 */
export const isNumber = (value: any): value is number => typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)

/**
  * Check if value is less than n
  * @param {number} value The value to check
  * @param {number} n The number to compare
  * @returns {boolean} True if value is less than n
  */
export const isNumberLower = (value: number, n: number): boolean => value < n

/**
  * Check if value is less than or equal to n
  * @param {number} value The value to check
  * @param {number} n The number to compare
  * @returns {boolean} True if value is less than or equal to n
  */
export const isNumberLowerOrEq = (value: number, n: number): boolean => value <= n

/**
  * Check if value is greater than n
  * @param {number} value The value to check
  * @param {number} n The number to compare
  * @returns {boolean} True if value is greater than n
  */
export const isNumberGreater = (value: number, n: number): boolean => value > n

/**
  * Check if value is greater than or equal to n
  * @param {number} value The value to check
  * @param {number} n The number to compare
  * @returns {boolean} True if value is greater than or equal to n
  */
export const isNumberGreaterOrEq = (value: number, n: number): boolean => value >= n

/**
  * Check if value is a number in the given range
  * @param {number} value The value to check
  * @param {{ min: number; max: number }} range The range to check
  * @returns {boolean} True if value is in the given range
  */
export const isNumberInRange = (value: number, { min, max }: { min: number; max: number }): boolean => value >= min && value <= max

/**
  * Check if value is a positive number
  * @param {number} value The value to check
  * @returns {boolean} True if value is a positive number
  */
export const isNumberPositive = (value: number): boolean => value >= 0

/**
  * Check if value is a negative number
  * @param {number} value The value to check
  * @returns {boolean} True if value is a negative number
  */
export const isNumberNegative = (value: number): boolean => value < 0

/**
  * Check if number is an integer
  * @param {number} value The number to check
  * @returns {boolean} True if number is an integer
  */
export const isNumberInteger = (value: number): boolean => Number.isInteger(value)

/**
  * Check if number is decimal
  * @param {number} value The number to check
  * @returns {boolean} True if number is decimal
  */
export const isNumberDecimal = (value: number): boolean => !Number.isInteger(value)

/**
  * Mandatory meme-quota function to check if number is odd
  * @param {number} value The number to check
  * @returns {boolean} True if value is odd
  */
export const isNumberOdd = (value: number): boolean => value % 2 === 1

/**
  * Mandatory meme-quota function to check if number is even
  * @param {number} value The number to check
  * @returns {boolean} True if value is even
  */
export const isNumberEven = (value: number): boolean => value % 2 === 0
