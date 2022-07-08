/**
  * Check if value is a negative number
  * @param {number} value The value to check
  * @returns {boolean} `true` if value is a negative number, `false` otherwise
  * @example
  * isNumberNegative(-1) // true
  * isNumberNegative(1) // false
  */
export const isNumberNegative = (value: number): boolean =>
  typeof value === 'number'
  && value < 0
