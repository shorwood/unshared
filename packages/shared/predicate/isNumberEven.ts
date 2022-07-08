/**
  * Mandatory meme function to check if number is even
  * @param {number} value The number to check
  * @returns {boolean} `true` if number is even, `false` otherwise
  * @example
  * isNumberEven(0) // true
  * isNumberEven(1) // false
  * isNumberEven(2.5) // false
  */
export const isNumberEven = (value: number): boolean =>
  typeof value === 'number'
  && Number.isInteger(value)
  && (value & 0x1) === 0
