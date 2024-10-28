/**
 * Escape the special characters in HTML strings. This allows you to display text that
 * contains HTML characters without the browser interpreting them as HTML elements.
 *
 * @param value The string to escape.
 * @returns The escaped string.
 * @throws If argument is not a string
 * @example escapeHtml('foo<bar>baz') // 'foo&lt;bar&gt;baz'
 */
export function escapeHtml(value: string): string {
  return value.replaceAll(/&(?!amp;|lt;|gt;|quot;|#39;)|<|>|"|'/g, (match) => {
    if (match === '&') return '&amp;'
    if (match === '<') return '&lt;'
    if (match === '>') return '&gt;'
    if (match === '"') return '&quot;'
    if (match === '\'') return '&#39;'
    return match
  })
}
