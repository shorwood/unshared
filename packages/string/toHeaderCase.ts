import { tokenize } from './tokenize'

/**
 * Converts a string to header case.
 *
 * @param value The string to convert.
 * @returns The converted string.
 * @throws If argument is not a string.
 * @example toHeaderCase('fooBar') // returns 'Foo-Bar'
 */
export function toHeaderCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Convert to header case.
  return tokenize(value)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join('-')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', 'Camel-Case'],
    ['PascalCase', 'Pascal-Case'],
    ['snake_case', 'Snake-Case'],
    ['kebab-case', 'Kebab-Case'],
    ['Title Case', 'Title-Case'],
    ['UPPER CASE', 'Upper-Case'],
    ['lower case', 'Lower-Case'],
  ])('should convert %s to %s', (input, expected) => {
    const result = toHeaderCase(input)
    expect(result).toEqual(expected)
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toHeaderCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
