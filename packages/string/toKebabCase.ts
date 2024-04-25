import { tokenize } from './tokenize'

/**
 * Convert a string to kebab case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to kebab case.
 * @example toKebabCase('FOO_BAR', 'Baz') // 'foo-bar-baz'
 */
export function toKebabCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.toLowerCase())
    .join('-')
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should convert camel-case to kebab-case', () => {
    const result = toKebabCase('camelCase')
    expect(result).toBe('camel-case')
  })

  test('should convert constant-case to kebab-case', () => {
    const result = toKebabCase('CONSTANT_CASE')
    expect(result).toBe('constant-case')
  })

  test('should convert dot-case to kebab-case', () => {
    const result = toKebabCase('dot.case')
    expect(result).toBe('dot-case')
  })

  test('should convert header-case to kebab-case', () => {
    const result = toKebabCase('Header-Case')
    expect(result).toBe('header-case')
  })

  test('should convert kebab-case to kebab-case', () => {
    const result = toKebabCase('kebab-case')
    expect(result).toBe('kebab-case')
  })

  test('should convert pascal-case to kebab-case', () => {
    const result = toKebabCase('PascalCase')
    expect(result).toBe('pascal-case')
  })

  test('should convert path-case to kebab-case', () => {
    const result = toKebabCase('path/case')
    expect(result).toBe('path-case')
  })

  test('should convert snake_case to kebab-case', () => {
    const result = toKebabCase('snake_case')
    expect(result).toBe('snake-case')
  })

  test('should convert title-case to kebab-case', () => {
    const result = toKebabCase('Title Case')
    expect(result).toBe('title-case')
  })

  test('should convert lower-case to kebab-case', () => {
    const result = toKebabCase('lower case')
    expect(result).toBe('lower-case')
  })

  test('should convert multiple strings to kebab-case', () => {
    const result = toKebabCase('foo', 'bar', 'baz')
    expect(result).toBe('foo-bar-baz')
  })
}
