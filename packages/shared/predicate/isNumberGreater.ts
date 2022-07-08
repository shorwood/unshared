/**
  * Check if value is greater than n
  * @param {number} value The value to check
  * @param {number} n The number to compare
  * @returns {boolean} `true` if value is greater than n, `false` otherwise
  * @example
  * isNumberGreater(2, 0) // true
  * isNumberGreater(2, 2) // false
  * isNumberGreater(2, 4) // false
  */
export const isNumberGreater = (value: number, n: number): boolean =>
  typeof value === 'number'
  && typeof n === 'number'
  && value > n
