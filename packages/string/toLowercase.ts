/**
 * Changes the case of a string to lower case. Is the same as
 * `String.prototype.toLowerCase` but provides type inference for
 * the new string.
 *
 * @param value The string to convert to lower case.
 * @returns The lower case string.
 * @example toLowerCase('FOO_BAR_1') // 'foo_bar_1'
 */
export function toLowercase<S extends string>(value: S): Lowercase<S> {
  return value.toLowerCase() as Lowercase<S>
}
