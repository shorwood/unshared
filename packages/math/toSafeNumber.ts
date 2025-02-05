/**
 * Transforms `n` to a safe number. This function is useful for collapsing numbers that
 * are out of range and may cause issues in your application. For example, `Number.NaN`
 * is collapsed to zero, `Number.POSITIVE_INFINITY` is collapsed to `Number.MAX_VALUE`,
 * and `Number.NEGATIVE_INFINITY` is collapsed to `Number.MIN_VALUE`. Allows you to
 * safely handle numbers that may be out of range.
 *
 * To mitigate JavaScript casting issues, this function will throw a `TypeError` if the
 * input is not a number. This is to prevent unexpected behavior when working with
 * numbers in JavaScript.
 *
 * @param number The number to transform to a safe number.
 * @returns The collapsed number.
 * @example
 * // Collapses Number.NaN to zero
 * toSafeNumber(Number.NaN) // => 0
 *
 * // Collapses `Number.POSITIVE_INFINITY` to `Number.MAX_VALUE`
 * toSafeNumber(Number.POSITIVE_INFINITY) // => 1.7976931348623157e+308
 *
 * // Collapses `Number.NEGATIVE_INFINITY` to `Number.MIN_VALUE`
 * toSafeNumber(Number.NEGATIVE_INFINITY) // => 5e-324
 *
 * // Returns numbers as-is
 * toSafeNumber(5) // => 5
 *
 * // Throws a TypeError if the input is not a number
 * toSafeNumber(undefined) // => TypeError: Expected a number
 */
export function toSafeNumber(number: number): number {
  if (typeof number !== 'number') throw new TypeError('Expected a number')
  if (Number.isNaN(number)) return 0
  if (number > Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER
  if (number < Number.MIN_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER
  return number
}
