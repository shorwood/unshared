/**
  * Check if the string ends with substr
  * @param {string} value The value to check
  * @param {string} substr The substring to look for
  * @returns {boolean} `true` if value ends with substr, `false` otherwise
  * @example
  * isStringEndingWith('foo', 'oo') // true
  * isStringEndingWith('foo', 'bar') // false
  */
export const isStringEndingWith = <S extends string>(value: string, substr: S): value is `${string}${S}` =>
  typeof value === 'string'
  && value.endsWith(substr)
