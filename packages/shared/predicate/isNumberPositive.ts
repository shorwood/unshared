/**
  * Check if value is a positive number
  * @param {number} value The value to check
  * @returns {boolean} `true` if value is a positive number, `false` otherwise
  * @example
  * isNumberPositive(1) // true
  * isNumberPositive(-1) // false
  */
export const isNumberPositive = (value: number): boolean =>
  typeof value === 'number' && value >= 0
