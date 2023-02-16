import { tokenize } from './tokenize'

/**
 * Convert a string to constant case.
 *
 * @param value The string to convert.
 * @returns The converted string.
 * @throws If `value` is not a string.
 * @example toConstantCase('fooBar') // returns 'FOO_BAR'
 */
export function toConstantCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Convert to constant case.
  return tokenize(value)
    .map(token => token.toUpperCase())
    .join('_')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', 'CAMEL_CASE'],
    ['PascalCase', 'PASCAL_CASE'],
    ['snake_case', 'SNAKE_CASE'],
    ['kebab-case', 'KEBAB_CASE'],
    ['Title Case', 'TITLE_CASE'],
    ['UPPER CASE', 'UPPER_CASE'],
    ['lower case', 'LOWER_CASE'],
  ])('should convert %s to %s', (input, expected) => {
    const result = toConstantCase(input)
    expect(result).toEqual(expected)
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toConstantCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
