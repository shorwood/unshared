/**
 * Remove trailing quotes from a string value. If the value is not quoted,
 * it is returned as is.
 *
 * @param string The string to remove trailing quotes from.
 * @returns The string without trailing quotes.
 * @example removeTrailingQuotes('"Hello, world!"') // 'Hello, world!'
 */
export function removeTrailingQuotes(string: string) {
  return string.startsWith('"') && string.endsWith('"')
    ? string.slice(1, -1)
    : string
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should remove trailing quotes from a string', () => {
    const result = removeTrailingQuotes('"Hello, world!"')
    expect(result).toBe('Hello, world!')
  })

  test('should not remove quotes from the middle of a string', () => {
    const result = removeTrailingQuotes('Hello, "world!"')
    expect(result).toBe('Hello, "world!"')
  })

  test('should not remove quotes from the beginning of a string', () => {
    const result = removeTrailingQuotes('"Hello", world!')
    expect(result).toBe('"Hello", world!')
  })

  test('should return the string as is if it is not quoted', () => {
    const result = removeTrailingQuotes('Hello, world!')
    expect(result).toBe('Hello, world!')
  })
}
