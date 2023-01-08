/**
 * Escape the Regular Expression special characters.
 * @param value The string to escape.
 * @return The escaped string.
 * @example
 * escapeRegExp('foo[bar]baz') // 'foo\[bar\]baz'
 */
export const escapeRegExp = (value: string): string =>
  value.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
