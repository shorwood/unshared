/**
  * Check if value is less than n
  * @param {number} value The value to check
  * @param {number} n The number to compare
  * @returns {boolean} `true` if value is less than n, `false` otherwises
  * @example
  * isNumberLower(2, 0) // false
  * isNumberLower(2, 2) // false
  * isNumberLower(2, 4) // true
  */
export const isNumberLower = (value: number, n: number): boolean =>
  typeof value === 'number'
  && typeof n === 'number'
  && value < n
