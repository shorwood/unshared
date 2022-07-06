/**
 * Escape the HTML special characters.
 * @param value The string to escape.
 * @returns The escaped string.
 */
export const escapeHtml = (value: string): string => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')
