/**
  * Mandatory meme function to check if number is odd
  * @param {number} value The number to check
  * @returns {boolean} `true` if number is odd, `false` otherwise
  * @example
  * isNumberOdd(0) // false
  * isNumberOdd(1) // true
  * isNumberOdd(2.5) // false
  */
export const isNumberOdd = (value: number): boolean =>
  typeof value === 'number'
  && Number.isInteger(value)
  && (value & 0x1) !== 0
