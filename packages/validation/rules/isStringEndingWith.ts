/**
 * Check if the string ends with substr
 *
 * @param value The value to check
 * @param substr The substring to look for
 * @returns `true` if value ends with substr, `false` otherwise
 * @example
 * isStringEndingWith('foo', 'oo') // true
 * isStringEndingWith('foo', 'bar') // false
 */
export function isStringEndingWith <S extends string>(value: string, substr: S): value is `${string}${S}` {
  return typeof value === 'string'
  && value.endsWith(substr)
}
