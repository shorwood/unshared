import { tokenize } from './tokenize'

/**
 * Converts a string to kebab case.
 *
 * @param value The string to convert
 * @returns The converted string
 * @example toKebabCase('fooBar') // returns 'foo-bar'
 */
export function toKebabCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Tokenize, lowercase each token and join with a dash.
  return tokenize(value)
    .map(token => token.toLowerCase())
    .join('-')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', 'camel-case'],
    ['PascalCase', 'pascal-case'],
    ['snake_case', 'snake-case'],
    ['kebab-case', 'kebab-case'],
    ['Title Case', 'title-case'],
    ['UPPER CASE', 'upper-case'],
    ['lower case', 'lower-case'],
  ])('should convert %s to %s', (input, expected) => {
    const result = toKebabCase(input)
    expect(result).toEqual(expected)
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toKebabCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
