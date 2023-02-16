import { tokenize } from './tokenize'

/**
 * Converts a string to path case.
 *
 * @param value The string to convert.
 * @returns The converted string.
 * @throws If argument is not a string.
 * @example toPathCase('fooBar') // returns 'foo/bar'
 */
export function toPathCase(value: string): string {
  if (typeof value !== 'string')
    throw new TypeError('Expected a string')

  // --- Tokenize, lowercase and join with underscores.
  return tokenize(value)
    .map(token => token.toLowerCase())
    .join('/')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it.each([
    ['camelCase', 'camel/case'],
    ['PascalCase', 'pascal/case'],
    ['snake_case', 'snake/case'],
    ['kebab-case', 'kebab/case'],
    ['Title Case', 'title/case'],
    ['UPPER CASE', 'upper/case'],
    ['lower case', 'lower/case'],
  ])('should convert %s to %s', (input, expected) => {
    const result = toPathCase(input)
    expect(result).toEqual(expected)
  })

  it('should throw if value is not a string', () => {
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => toPathCase(1)
    expect(shouldThrow).toThrow(TypeError)
  })
}
