import { tokenize } from './tokenize'

/**
 * Convert a string to title case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to title case.
 * @example toTitleCase('FOO_BAR', 'Baz') // 'Foo Bar Baz'
 */
export function toTitleCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ')
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should convert camel-case to title-case', () => {
    const result = toTitleCase('camelCase')
    expect(result).toBe('Camel Case')
  })

  test('should convert constant-case to title-case', () => {
    const result = toTitleCase('CONSTANT_CASE')
    expect(result).toBe('Constant Case')
  })

  test('should convert dot-case to title-case', () => {
    const result = toTitleCase('dot.case')
    expect(result).toBe('Dot Case')
  })

  test('should convert header-case to title-case', () => {
    const result = toTitleCase('Header-Case')
    expect(result).toBe('Header Case')
  })

  test('should convert kebab-case to title-case', () => {
    const result = toTitleCase('kebab-case')
    expect(result).toBe('Kebab Case')
  })

  test('should convert pascal-case to title-case', () => {
    const result = toTitleCase('PascalCase')
    expect(result).toBe('Pascal Case')
  })

  test('should convert path-case to title-case', () => {
    const result = toTitleCase('path/case')
    expect(result).toBe('Path Case')
  })

  test('should convert snake_case to title-case', () => {
    const result = toTitleCase('snake_case')
    expect(result).toBe('Snake Case')
  })

  test('should convert title-case to title-case', () => {
    const result = toTitleCase('Title Case')
    expect(result).toBe('Title Case')
  })

  test('should convert lower-case to title-case', () => {
    const result = toTitleCase('lower case')
    expect(result).toBe('Lower Case')
  })

  test('should convert multiple strings to title-case', () => {
    const result = toTitleCase('foo', 'bar', 'baz')
    expect(result).toBe('Foo Bar Baz')
  })
}
