/**
 * Mandatory meme function to check if number is even
 *
 * @param value The number to check
 * @returns `true` if number is even, `false` otherwise
 * @example
 * isNumberEven(0) // true
 * isNumberEven(1) // false
 * isNumberEven(2.5) // false
 */
export function isNumberEven(value: number): boolean {
  return typeof value === 'number'
  && Number.isInteger(value)
  && (value & 0x1) === 0
}
