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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should escape HTML ampersands', () => {
    const result = escapeHtml('foo&bar')
    expect(result).toBe('foo&amp;bar')
  })

  test('should not escape already escaped HTML ampersands', () => {
    const result = escapeHtml('foo&amp;bar')
    expect(result).toBe('foo&amp;bar')
  })

  test('should escape HTML less-than signs', () => {
    const result = escapeHtml('foo<bar')
    expect(result).toBe('foo&lt;bar')
  })

  test('should escape HTML greater-than signs', () => {
    const result = escapeHtml('foo>bar')
    expect(result).toBe('foo&gt;bar')
  })

  test('should escape HTML double quotes', () => {
    const result = escapeHtml('foo"bar')
    expect(result).toBe('foo&quot;bar')
  })

  test('should escape HTML single quotes', () => {
    const result = escapeHtml('foo\'bar')
    expect(result).toBe('foo&#39;bar')
  })

  test('should throw if value is not a string', () => {

    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => escapeHtml(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
