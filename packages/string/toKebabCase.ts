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

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to kebab-case', () => {
    const result = toKebabCase('camelCase')
    expect(result).toEqual('camel-case')
  })

  it('should convert constant-case to kebab-case', () => {
    const result = toKebabCase('CONSTANT_CASE')
    expect(result).toEqual('constant-case')
  })

  it('should convert dot-case to kebab-case', () => {
    const result = toKebabCase('dot.case')
    expect(result).toEqual('dot-case')
  })

  it('should convert header-case to kebab-case', () => {
    const result = toKebabCase('Header-Case')
    expect(result).toEqual('header-case')
  })

  it('should convert kebab-case to kebab-case', () => {
    const result = toKebabCase('kebab-case')
    expect(result).toEqual('kebab-case')
  })

  it('should convert pascal-case to kebab-case', () => {
    const result = toKebabCase('PascalCase')
    expect(result).toEqual('pascal-case')
  })

  it('should convert path-case to kebab-case', () => {
    const result = toKebabCase('path/case')
    expect(result).toEqual('path-case')
  })

  it('should convert snake_case to kebab-case', () => {
    const result = toKebabCase('snake_case')
    expect(result).toEqual('snake-case')
  })

  it('should convert title-case to kebab-case', () => {
    const result = toKebabCase('Title Case')
    expect(result).toEqual('title-case')
  })

  it('should convert lower-case to kebab-case', () => {
    const result = toKebabCase('lower case')
    expect(result).toEqual('lower-case')
  })

  it('should convert multiple strings to kebab-case', () => {
    const result = toKebabCase('foo', 'bar', 'baz')
    expect(result).toEqual('foo-bar-baz')
  })
}
