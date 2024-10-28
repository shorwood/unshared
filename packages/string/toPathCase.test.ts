import { toPathCase } from './toPathCase'

describe('toPathCase', () => {
  test('should convert camel-case to path-case', () => {
    const result = toPathCase('camelCase')
    expect(result).toBe('camel/case')
  })

  test('should convert constant-case to path-case', () => {
    const result = toPathCase('CONSTANT_CASE')
    expect(result).toBe('constant/case')
  })

  test('should convert dot-case to path-case', () => {
    const result = toPathCase('dot.case')
    expect(result).toBe('dot/case')
  })

  test('should convert header-case to path-case', () => {
    const result = toPathCase('Header-Case')
    expect(result).toBe('header/case')
  })

  test('should convert kebab-case to path-case', () => {
    const result = toPathCase('kebab-case')
    expect(result).toBe('kebab/case')
  })

  test('should convert pascal-case to path-case', () => {
    const result = toPathCase('PascalCase')
    expect(result).toBe('pascal/case')
  })

  test('should convert path-case to path-case', () => {
    const result = toPathCase('path/case')
    expect(result).toBe('path/case')
  })

  test('should convert snake_case to path-case', () => {
    const result = toPathCase('snake_case')
    expect(result).toBe('snake/case')
  })

  test('should convert title-case to path-case', () => {
    const result = toPathCase('Title Case')
    expect(result).toBe('title/case')
  })

  test('should convert lower-case to path-case', () => {
    const result = toPathCase('lower case')
    expect(result).toBe('lower/case')
  })

  test('should convert multiple strings to path-case', () => {
    const result = toPathCase('foo', 'bar', 'baz')
    expect(result).toBe('foo/bar/baz')
  })
})
