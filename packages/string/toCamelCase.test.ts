import { toCamelCase } from './toCamelCase'

describe('toCamelCase', () => {
  test('should convert camel-case to camel-case', () => {
    const result = toCamelCase('camelCase')
    expect(result).toBe('camelCase')
  })

  test('should convert constant-case to camel-case', () => {
    const result = toCamelCase('CONSTANT_CASE')
    expect(result).toBe('constantCase')
  })

  test('should convert dot-case to camel-case', () => {
    const result = toCamelCase('dot.case')
    expect(result).toBe('dotCase')
  })

  test('should convert header-case to camel-case', () => {
    const result = toCamelCase('Header-Case')
    expect(result).toBe('headerCase')
  })

  test('should convert kebab-case to camel-case', () => {
    const result = toCamelCase('kebab-case')
    expect(result).toBe('kebabCase')
  })

  test('should convert pascal-case to camel-case', () => {
    const result = toCamelCase('PascalCase')
    expect(result).toBe('pascalCase')
  })

  test('should convert path-case to camel-case', () => {
    const result = toCamelCase('path/case')
    expect(result).toBe('pathCase')
  })

  test('should convert snake_case to camel-case', () => {
    const result = toCamelCase('snake_case')
    expect(result).toBe('snakeCase')
  })

  test('should convert title-case to camel-case', () => {
    const result = toCamelCase('Title Case')
    expect(result).toBe('titleCase')
  })

  test('should convert lower-case to camel-case', () => {
    const result = toCamelCase('lower case')
    expect(result).toBe('lowerCase')
  })

  test('should convert multiple strings to camel-case', () => {
    const result = toCamelCase('foo', 'bar', 'baz')
    expect(result).toBe('fooBarBaz')
  })
})
