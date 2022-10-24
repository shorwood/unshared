/**
  * Check if the string is as short or shorter than length
  * @param value The value to check
  * @param length The length to compare to
  * @return `true` if the string is as short or shorter than length, `false` otherwise
  * @example
  * isStringShorterOrEq('foo', 3) // true
  * isStringShorterOrEq('foobar', 3) // false
  */
export const isStringShorterOrEq = (value: string, length: number): boolean =>
  typeof value === 'string'
  && typeof length === 'number'
  && value.length <= length
