/**
 * Tokenize a string into an array of strings.
 *
 * @param value The string to tokenize
 * @returns The list of tokens
 * @example
 * tokenize('This is a test') // => ['This', 'is', 'a', 'test']
 */
export const tokenize = (value: string): string[] => {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Extract all tokens.
  value = value.trim()
  const tokens = value.matchAll(/[\dA-Z]?[\da-z]+|[\dA-Za-z]+/gs)

  // --- Return tokens as an array of strings.
  return [...tokens].map(token => token[0])
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', ['camel', 'Case']],
    ['PascalCase', ['Pascal', 'Case']],
    ['snake_case', ['snake', 'case']],
    ['kebab-case', ['kebab', 'case']],
    ['Title Case', ['Title', 'Case']],
    ['UPPER CASE', ['UPPER', 'CASE']],
    ['lower case', ['lower', 'case']],
  ])('should tokenize %s', (input, expected) => {
    const result = tokenize(input)
    expect(result).toEqual(expected)
  })

  it('should handle numbers as tokens', () => {
    const result = tokenize('Foo123Bar')
    expect(result).toEqual(['Foo', '123', 'Bar'])
  })

  it('should tokenize empty string', () => {
    const result = tokenize('\n\t\r ')
    expect(result).toEqual([])
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => tokenize(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
