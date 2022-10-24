/**
  * Check if the string starts with substr
  * @param value The value to check
  * @param substr The substring to look for
  * @return `true` if value starts with substr, `false` otherwise
  * @example
  * isStringStartingWith('foo', 'fo') // true
  * isStringStartingWith('foo', 'bar') // false
  */
export const isStringStartingWith = <S extends string>(value: string, substr: S): value is `${S}${string}` =>
  typeof value === 'string'
  && typeof substr === 'string'
  && value.startsWith(substr)
