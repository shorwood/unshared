/**
 * Escape the HTML special characters.
 * @param value The string to escape.
 * @return The escaped string.
 * @example
 * escapeHtml('foo<bar>baz') // 'foo&lt;bar&gt;baz'
 */
export const escapeHtml = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
