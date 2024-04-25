import { tokenize } from './tokenize'

/**
 * Convert a string to dot case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to dot case.
 * @example toDotCase('FOO_BAR', 'Baz') // 'foo.bar.baz'
 */
export function toDotCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.toLowerCase())
    .join('.')
}

/* v8 ignore next */
if (import.meta.vitest) {
  test('should convert camel-case to dot-case', () => {
    const result = toDotCase('camelCase')
    expect(result).toBe('camel.case')
  })

  test('should convert constant-case to dot-case', () => {
    const result = toDotCase('CONSTANT_CASE')
    expect(result).toBe('constant.case')
  })

  test('should convert dot-case to dot-case', () => {
    const result = toDotCase('dot.case')
    expect(result).toBe('dot.case')
  })

  test('should convert header-case to dot-case', () => {
    const result = toDotCase('Header-Case')
    expect(result).toBe('header.case')
  })

  test('should convert kebab-case to dot-case', () => {
    const result = toDotCase('kebab-case')
    expect(result).toBe('kebab.case')
  })

  test('should convert pascal-case to dot-case', () => {
    const result = toDotCase('PascalCase')
    expect(result).toBe('pascal.case')
  })

  test('should convert path-case to dot-case', () => {
    const result = toDotCase('path/case')
    expect(result).toBe('path.case')
  })

  test('should convert snake_case to dot-case', () => {
    const result = toDotCase('snake_case')
    expect(result).toBe('snake.case')
  })

  test('should convert title-case to dot-case', () => {
    const result = toDotCase('Title Case')
    expect(result).toBe('title.case')
  })

  test('should convert lower-case to dot-case', () => {
    const result = toDotCase('lower case')
    expect(result).toBe('lower.case')
  })

  test('should convert multiple strings to dot-case', () => {
    const result = toDotCase('foo', 'bar', 'baz')
    expect(result).toBe('foo.bar.baz')
  })
}
