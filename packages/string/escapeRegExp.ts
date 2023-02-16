/**
 * Escape the Regular Expression special characters.
 *
 * @param value The string to escape.
 * @returns The escaped string.
 * @example
 * escapeRegExp('foo[bar]baz') // 'foo\[bar\]baz'
 */
export function escapeRegExp(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Escape the special RegExp characters.
  return value.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should escape RegExp backslashes', () => {
    const result = escapeRegExp('foo\\bar')
    expect(result).toEqual('foo\\\\bar')
  })

  it('should escape RegExp square brackets', () => {
    const result = escapeRegExp('foo[bar]baz')
    expect(result).toEqual('foo\\[bar\\]baz')
  })

  it('should escape RegExp parentheses', () => {
    const result = escapeRegExp('foo(bar)baz')
    expect(result).toEqual('foo\\(bar\\)baz')
  })

  it('should escape RegExp plus signs', () => {
    const result = escapeRegExp('foo+bar+baz')
    expect(result).toEqual('foo\\+bar\\+baz')
  })

  it('should escape RegExp dots', () => {
    const result = escapeRegExp('foo.bar.baz')
    expect(result).toEqual('foo\\.bar\\.baz')
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => escapeRegExp(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
