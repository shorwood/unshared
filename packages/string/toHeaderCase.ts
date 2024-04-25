import { tokenize } from './tokenize'

/**
 * Convert a string to header case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to header case.
 * @example toHeaderCase('FOO_BAR', 'Baz') // 'Foo-Bar-Baz'
 */
export function toHeaderCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join('-')
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should convert camel-case to header-case', () => {
    const result = toHeaderCase('camelCase')
    expect(result).toBe('Camel-Case')
  })

  test('should convert constant-case to header-case', () => {
    const result = toHeaderCase('CONSTANT_CASE')
    expect(result).toBe('Constant-Case')
  })

  test('should convert dot-case to header-case', () => {
    const result = toHeaderCase('dot.case')
    expect(result).toBe('Dot-Case')
  })

  test('should convert header-case to header-case', () => {
    const result = toHeaderCase('Header-Case')
    expect(result).toBe('Header-Case')
  })

  test('should convert kebab-case to header-case', () => {
    const result = toHeaderCase('kebab-case')
    expect(result).toBe('Kebab-Case')
  })

  test('should convert pascal-case to header-case', () => {
    const result = toHeaderCase('PascalCase')
    expect(result).toBe('Pascal-Case')
  })

  test('should convert path-case to header-case', () => {
    const result = toHeaderCase('path/case')
    expect(result).toBe('Path-Case')
  })

  test('should convert snake_case to header-case', () => {
    const result = toHeaderCase('snake_case')
    expect(result).toBe('Snake-Case')
  })

  test('should convert title-case to header-case', () => {
    const result = toHeaderCase('Title Case')
    expect(result).toBe('Title-Case')
  })

  test('should convert lower-case to header-case', () => {
    const result = toHeaderCase('lower case')
    expect(result).toBe('Lower-Case')
  })

  test('should convert multiple strings to header-case', () => {
    const result = toHeaderCase('foo', 'bar', 'baz')
    expect(result).toBe('Foo-Bar-Baz')
  })
}
