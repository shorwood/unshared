import { tokenize } from './tokenize'

/**
 * Converts a string to camel case.
 *
 * @param value The string to convert
 * @returns The converted string
 * @throws If `value` is not a string
 * @example toCamelCase('foo_bar') // returns 'fooBar'
 */
export function toCamelCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Tokenize, capitalize from the second token and join.
  return tokenize(value)
    .map((token, index) => (
      index > 0
        ? token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
        : token.toLowerCase()
    ))
    .join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', 'camelCase'],
    ['PascalCase', 'pascalCase'],
    ['snake_case', 'snakeCase'],
    ['kebab-case', 'kebabCase'],
    ['Title Case', 'titleCase'],
    ['UPPER CASE', 'upperCase'],
    ['lower case', 'lowerCase'],
  ])('should convert %s to %s', (input, expected) => {
    const result = toCamelCase(input)
    expect(result).toEqual(expected)
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toCamelCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
