import { tokenize } from './tokenize'

describe('tokenize', () => {
  test('should tokenize empty string', () => {
    const result = tokenize('\n\t\r ')
    expect(result).toStrictEqual([])
  })

  test('should tokenize camel case', () => {
    const result = tokenize('fooBar123')
    expect(result).toStrictEqual(['foo', 'Bar', '123'])
  })

  test('should tokenize pascal case', () => {
    const result = tokenize('FooBar123')
    expect(result).toStrictEqual(['Foo', 'Bar', '123'])
  })

  test('should tokenize snake case', () => {
    const result = tokenize('foo_bar_123')
    expect(result).toStrictEqual(['foo', 'bar', '123'])
  })

  test('should tokenize kebab case', () => {
    const result = tokenize('foo-bar-123')
    expect(result).toStrictEqual(['foo', 'bar', '123'])
  })

  test('should tokenize title case', () => {
    const result = tokenize('Foo Bar 123')
    expect(result).toStrictEqual(['Foo', 'Bar', '123'])
  })

  test('should tokenize dot case', () => {
    const result = tokenize('foo.bar.123')
    expect(result).toStrictEqual(['foo', 'bar', '123'])
  })

  test('should tokenize header case', () => {
    const result = tokenize('Foo-Bar-123')
    expect(result).toStrictEqual(['Foo', 'Bar', '123'])
  })

  test('should tokenize path case', () => {
    const result = tokenize('foo/bar/123')
    expect(result).toStrictEqual(['foo', 'bar', '123'])
  })

  test('should tokenize constant case', () => {
    const result = tokenize('FOO_BAR_123')
    expect(result).toStrictEqual(['FOO', 'BAR', '123'])
  })

  test('should tokenize mixed case', () => {
    const result = tokenize('FOO_Bar.123')
    expect(result).toStrictEqual(['FOO', 'Bar', '123'])
  })
})
