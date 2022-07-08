/**
 * Escape the HTML special characters.
 * @param {string} value The string to escape.
 * @returns {string} The escaped string.
 * @example
 * escapeHtml('foo<bar>baz') // 'foo&lt;bar&gt;baz'
 */
export const escapeHtml = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
