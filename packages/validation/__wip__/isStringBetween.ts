/**
 * Check if the string's length is between min and max
 *
 * @param value The value to check
 * @param range The minimum and maximim length
 * @param range.min The minimum length
 * @param range.max The maximum length
 * @returns `true` if the string's length is between min and max, `false` otherwise
 * @example
 * isStringBetween('foo', { min: 3 }) // true
 * isStringBetween('foo', { min: 6, max: 10 }) // false
 */
export function isStringBetween(value: string, { min, max }: { min?: number; max?: number } = {}): boolean {
  return typeof value === 'string'
    && (typeof min === 'number' ? value.length >= min : true)
    && (typeof max === 'number' ? value.length <= max : true)
}
