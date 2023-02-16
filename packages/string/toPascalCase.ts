import { tokenize } from './tokenize'

/**
 * Converts a string to pascal case.
 *
 * @param value The string to convert
 * @returns The converted string
 * @example toCamelCase('fooBar') // returns 'FooBar'
 */
export function toPascalCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Tokenize, capitalize the first letter of each token and join.
  return tokenize(value)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', 'CamelCase'],
    ['PascalCase', 'PascalCase'],
    ['snake_case', 'SnakeCase'],
    ['kebab-case', 'KebabCase'],
    ['Title Case', 'TitleCase'],
    ['UPPER CASE', 'UpperCase'],
    ['lower case', 'LowerCase'],
  ])('should convert %s to %s', (input, expected) => {
    const result = toPascalCase(input)
    expect(result).toEqual(expected)
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toPascalCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
