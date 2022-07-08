/**
  * Check if value is greater than n
  * @param {number} value The value to check
  * @param {number} n The number to compare
  * @returns {boolean} `true` if value is greater than n, `false` otherwise
  * @example
  * isNumberGreaterOrEq(2, 0) // true
  * isNumberGreaterOrEq(2, 2) // true
  * isNumberGreaterOrEq(2, 4) // false
  */
export const isNumberGreaterOrEq = (value: number, n: number): boolean =>
  typeof value === 'number'
  && typeof n === 'number'
  && value >= n
