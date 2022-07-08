/**
 * Escape the Regular Expression special characters.
 * @param {string} value The string to escape.
 * @returns {string} The escaped string.
 * @example
 * escapeRegExp('foo[bar]baz') // 'foo\[bar\]baz'
 */
export const escapeRegExp = (value: string): string =>
  value.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
