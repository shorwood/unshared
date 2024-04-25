import { tokenize } from './tokenize'

/**
 * Convert a string to constant case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to constant case.
 * @example toConstantCase('FOO_BAR', 'Baz') // 'FOO_BAR_BAZ'
 */
export function toConstantCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.toUpperCase())
    .join('_')
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should convert camel-case to constant-case', () => {
    const result = toConstantCase('camelCase')
    expect(result).toBe('CAMEL_CASE')
  })

  test('should convert constant-case to constant-case', () => {
    const result = toConstantCase('CONSTANT_CASE')
    expect(result).toBe('CONSTANT_CASE')
  })

  test('should convert dot-case to constant-case', () => {
    const result = toConstantCase('dot.case')
    expect(result).toBe('DOT_CASE')
  })

  test('should convert header-case to constant-case', () => {
    const result = toConstantCase('Header-Case')
    expect(result).toBe('HEADER_CASE')
  })

  test('should convert kebab-case to constant-case', () => {
    const result = toConstantCase('kebab-case')
    expect(result).toBe('KEBAB_CASE')
  })

  test('should convert pascal-case to constant-case', () => {
    const result = toConstantCase('PascalCase')
    expect(result).toBe('PASCAL_CASE')
  })

  test('should convert path-case to constant-case', () => {
    const result = toConstantCase('path/case')
    expect(result).toBe('PATH_CASE')
  })

  test('should convert snake_case to constant-case', () => {
    const result = toConstantCase('snake_case')
    expect(result).toBe('SNAKE_CASE')
  })

  test('should convert title-case to constant-case', () => {
    const result = toConstantCase('Title Case')
    expect(result).toBe('TITLE_CASE')
  })

  test('should convert lower-case to constant-case', () => {
    const result = toConstantCase('lower case')
    expect(result).toBe('LOWER_CASE')
  })

  test('should convert multiple strings to constantcamel-case', () => {
    const result = toConstantCase('foo', 'bar', 'baz')
    expect(result).toBe('FOO_BAR_BAZ')
  })
}
