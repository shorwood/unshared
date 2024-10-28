import { toSnakeCase } from './toSnakeCase'

describe('toSnakeCase', () => {
  test('should convert camel-case to snake-case', () => {
    const result = toSnakeCase('camelCase')
    expect(result).toBe('camel_case')
  })

  test('should convert constant-case to snake-case', () => {
    const result = toSnakeCase('CONSTANT_CASE')
    expect(result).toBe('constant_case')
  })

  test('should convert dot-case to snake-case', () => {
    const result = toSnakeCase('dot.case')
    expect(result).toBe('dot_case')
  })

  test('should convert header-case to snake-case', () => {
    const result = toSnakeCase('Header-Case')
    expect(result).toBe('header_case')
  })

  test('should convert kebab-case to snake-case', () => {
    const result = toSnakeCase('kebab-case')
    expect(result).toBe('kebab_case')
  })

  test('should convert pascal-case to snake-case', () => {
    const result = toSnakeCase('PascalCase')
    expect(result).toBe('pascal_case')
  })

  test('should convert path-case to snake-case', () => {
    const result = toSnakeCase('path/case')
    expect(result).toBe('path_case')
  })

  test('should convert snake_case to snake-case', () => {
    const result = toSnakeCase('snake_case')
    expect(result).toBe('snake_case')
  })

  test('should convert title-case to snake-case', () => {
    const result = toSnakeCase('Title Case')
    expect(result).toBe('title_case')
  })

  test('should convert lower-case to snake-case', () => {
    const result = toSnakeCase('lower case')
    expect(result).toBe('lower_case')
  })

  test('should convert multiple strings to snake-case', () => {
    const result = toSnakeCase('foo', 'bar', 'baz')
    expect(result).toBe('foo_bar_baz')
  })
})
