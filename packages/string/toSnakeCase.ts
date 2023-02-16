import { tokenize } from './tokenize'

/**
 * Converts a string to snake case.
 *
 * @param value The string to convert
 * @returns The converted string
 * @throws If `value` is not a string
 * @example toCamelCase('fooBar') // returns 'foo_bar'
 */
export function toSnakeCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Tokenize, lowercase and join with underscores.
  return tokenize(value)
    .map(token => token.toLowerCase())
    .join('_')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', 'camel_case'],
    ['PascalCase', 'pascal_case'],
    ['snake_case', 'snake_case'],
    ['kebab-case', 'kebab_case'],
    ['Title Case', 'title_case'],
    ['UPPER CASE', 'upper_case'],
    ['lower case', 'lower_case'],
  ])('should convert %s to %s', (input, expected) => {
    const result = toSnakeCase(input)
    expect(result).toEqual(expected)
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toSnakeCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
