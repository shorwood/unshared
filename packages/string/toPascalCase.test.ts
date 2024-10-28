import { toPascalCase } from './toPascalCase'

describe('toPascalCase', () => {
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
})
