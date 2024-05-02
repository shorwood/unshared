/**
 * Check if the string starts with substr
 *
 * @param value The value to check
 * @param substr The substring to look for
 * @returns `true` if value starts with substr, `false` otherwise
 * @example
 * isStringStartingWith('foo', 'fo') // true
 * isStringStartingWith('foo', 'bar') // false
 */
export function isStringStartingWith<S extends string>(value: string, substr: S): value is `${S}${string}` {
  return typeof value === 'string' && value.startsWith(substr)
}
