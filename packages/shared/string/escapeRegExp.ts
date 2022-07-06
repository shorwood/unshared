/**
 * Escape the Regular Expression special characters.
 * @param value The string to escape.
 * @returns The escaped string.
 */
export const escapeRegExp = (value: string): string =>
  value.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
