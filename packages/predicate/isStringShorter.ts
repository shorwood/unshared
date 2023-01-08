/**
  * Check if the string is shorter than length
  * @param value The value to check
  * @param length The length to compare to
  * @return `true` if the string is shorter than length, `false` otherwise
  * @example
  * isStringShorter('foo', 6) // true
  * isStringShorter('foobar', 6) // false
  */
export const isStringShorter = (value: string, length: number): boolean =>
  typeof value === 'string'
  && typeof length === 'number'
  && value.length < length
