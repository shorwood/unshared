/**
  * Check if number is an integer
  * @param {number} value The number to check
  * @returns {boolean} `true` if number is an integer, `false` otherwise
  * @example
  * isNumberInteger(1) // true
  * isNumberInteger(1.5) // false
  */
export const isNumberInteger = (value: number): boolean =>
  typeof value === 'number'
  && Number.isInteger(value)
