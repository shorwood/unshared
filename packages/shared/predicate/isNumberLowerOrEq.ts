/**
  * Check if value is less than or equal to n
  * @param {number} value The value to check
  * @param {number} n The number to compare
  * @returns {boolean} `true` if value is less than or equal to n, `false` otherwise
  * @example
  * isNumberLowerOrEq(2, 0) // false
  * isNumberLowerOrEq(2, 2) // true
  * isNumberLowerOrEq(2, 4) // true
  */
export const isNumberLowerOrEq = (value: number, n: number): boolean =>
  typeof value === 'number'
  && typeof n === 'number'
  && value <= n
