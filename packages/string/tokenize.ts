/**
 * Tokenize a string into an array of strings. Each token is a sequence of
 * characters that are separated by a non-alphanumeric character or by a
 * change in case.
 *
 * @param string The string to tokenize into an array of tokens.
 * @returns The list of tokens extracted from the string.
 * @example tokenize('fooBar') // => ['foo', 'Bar']
 */
export function tokenize(string: string): string[] {
  return [...string.trim().matchAll(/[A-Z]?[a-z]+|[A-Z]+|\d+/gs)].map(match => match[0])
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should tokenize empty string', () => {
    const result = tokenize('\n\t\r ')
    expect(result).toEqual([])
  })

  it('should tokenize camel case', () => {
    const result = tokenize('fooBar123')
    expect(result).toEqual(['foo', 'Bar', '123'])
  })

  it('should tokenize pascal case', () => {
    const result = tokenize('FooBar123')
    expect(result).toEqual(['Foo', 'Bar', '123'])
  })

  it('should tokenize snake case', () => {
    const result = tokenize('foo_bar_123')
    expect(result).toEqual(['foo', 'bar', '123'])
  })

  it('should tokenize kebab case', () => {
    const result = tokenize('foo-bar-123')
    expect(result).toEqual(['foo', 'bar', '123'])
  })

  it('should tokenize title case', () => {
    const result = tokenize('Foo Bar 123')
    expect(result).toEqual(['Foo', 'Bar', '123'])
  })

  it('should tokenize dot case', () => {
    const result = tokenize('foo.bar.123')
    expect(result).toEqual(['foo', 'bar', '123'])
  })

  it('should tokenize constant case', () => {
    const result = tokenize('FOO_BAR_123')
    expect(result).toEqual(['FOO', 'BAR', '123'])
  })

  it('should tokenize mixed case', () => {
    const result = tokenize('FOO_Bar.123')
    expect(result).toEqual(['FOO', 'Bar', '123'])
  })
}
