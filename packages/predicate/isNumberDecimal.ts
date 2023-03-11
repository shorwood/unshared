/**
 * Check if number is a finite decimal number
 *
 * @param value The number to check
 * @returns `true` if value is a finite decimal number, `false` otherwise
 * @example
 * isNumberDecimal(0) // false
 * isNumberDecimal(0.5) // true
 */
export const isNumberDecimal = (value: number): boolean =>
  typeof value === 'number'
  && !Number.isNaN(value)
  && Number.isFinite(value)
  && !Number.isInteger(value)
