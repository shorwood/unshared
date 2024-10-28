/**
 * Changes the case of a string to upper case. Is the same as
 * `String.prototype.toUpperCase` but provides type inference for
 * the new string.
 *
 * @param value The string to convert to upper case.
 * @returns The upper case string.
 * @example toUpperCase('foo_bar_1') // 'FOO_BAR_1'
 */
export function toUppercase<S extends string>(value: S): Uppercase<S> {
  return value.toUpperCase() as Uppercase<S>
}
