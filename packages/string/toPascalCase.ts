import { tokenize } from './tokenize'

/**
 * Convert a string to pascal case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to pascal case.
 * @example toConstantCase('FOO_BAR', 'Baz') // 'FooBarBaz'
 */
export function toPascalCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join('')
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should convert camel-case to pascal-case', () => {
    const result = toPascalCase('camelCase')
    expect(result).toBe('CamelCase')
  })

  test('should convert constant-case to pascal-case', () => {
    const result = toPascalCase('CONSTANT_CASE')
    expect(result).toBe('ConstantCase')
  })

  test('should convert dot-case to pascal-case', () => {
    const result = toPascalCase('dot.case')
    expect(result).toBe('DotCase')
  })

  test('should convert header-case to pascal-case', () => {
    const result = toPascalCase('Header-Case')
    expect(result).toBe('HeaderCase')
  })

  test('should convert kebab-case to pascal-case', () => {
    const result = toPascalCase('kebab-case')
    expect(result).toBe('KebabCase')
  })

  test('should convert pascal-case to pascal-case', () => {
    const result = toPascalCase('PascalCase')
    expect(result).toBe('PascalCase')
  })

  test('should convert path-case to pascal-case', () => {
    const result = toPascalCase('path/case')
    expect(result).toBe('PathCase')
  })

  test('should convert snake_case to pascal-case', () => {
    const result = toPascalCase('snake_case')
    expect(result).toBe('SnakeCase')
  })

  test('should convert title-case to pascal-case', () => {
    const result = toPascalCase('Title Case')
    expect(result).toBe('TitleCase')
  })

  test('should convert multiple strings to pascal-case', () => {
    const result = toPascalCase('foo', 'bar', 'baz')
    expect(result).toBe('FooBarBaz')
  })
}
