import { toSlug } from './toSlug'

describe('toSlug', () => {
  test('should convert camel-case to pascal-case', () => {
    const result = toSlug('camelCase')
    expect(result).toBe('camel-case')
  })

  test('should convert constant-case to pascal-case', () => {
    const result = toSlug('CONSTANT_CASE')
    expect(result).toBe('constant-case')
  })

  test('should convert dot-case to pascal-case', () => {
    const result = toSlug('dot.case')
    expect(result).toBe('dot-case')
  })

  test('should convert header-case to pascal-case', () => {
    const result = toSlug('Header-Case')
    expect(result).toBe('header-case')
  })

  test('should convert kebab-case to pascal-case', () => {
    const result = toSlug('kebab-case')
    expect(result).toBe('kebab-case')
  })

  test('should convert pascal-case to pascal-case', () => {
    const result = toSlug('PascalCase')
    expect(result).toBe('pascal-case')
  })

  test('should convert path-case to pascal-case', () => {
    const result = toSlug('path/case')
    expect(result).toBe('path-case')
  })

  test('should convert snake_case to pascal-case', () => {
    const result = toSlug('snake_case')
    expect(result).toBe('snake-case')
  })

  test('should convert title-case to pascal-case', () => {
    const result = toSlug('Title Case')
    expect(result).toBe('title-case')
  })

  test('should convert multiple strings to pascal-case', () => {
    const result = toSlug('foo', 'bar', 'baz')
    expect(result).toBe('foo-bar-baz')
  })

  test('should convert string with diacritics to pascal-case', () => {
    const result = toSlug('Bâz')
    expect(result).toBe('baz')
  })
})
