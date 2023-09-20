import { tokenize } from './tokenize'

/**
 * Convert a string to camel case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string in camel case.
 * @example toCamelCase('FOO_BAR', 'Baz') // 'fooBarBaz'
 */
export function toCamelCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map((token, index) => (
      index > 0
        ? token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()
        : token.toLowerCase()
    ))
    .join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to camel-case', () => {
    const result = toCamelCase('camelCase')
    expect(result).toEqual('camelCase')
  })

  it('should convert constant-case to camel-case', () => {
    const result = toCamelCase('CONSTANT_CASE')
    expect(result).toEqual('constantCase')
  })

  it('should convert dot-case to camel-case', () => {
    const result = toCamelCase('dot.case')
    expect(result).toEqual('dotCase')
  })

  it('should convert header-case to camel-case', () => {
    const result = toCamelCase('Header-Case')
    expect(result).toEqual('headerCase')
  })

  it('should convert kebab-case to camel-case', () => {
    const result = toCamelCase('kebab-case')
    expect(result).toEqual('kebabCase')
  })

  it('should convert pascal-case to camel-case', () => {
    const result = toCamelCase('PascalCase')
    expect(result).toEqual('pascalCase')
  })

  it('should convert path-case to camel-case', () => {
    const result = toCamelCase('path/case')
    expect(result).toEqual('pathCase')
  })

  it('should convert snake_case to camel-case', () => {
    const result = toCamelCase('snake_case')
    expect(result).toEqual('snakeCase')
  })

  it('should convert title-case to camel-case', () => {
    const result = toCamelCase('Title Case')
    expect(result).toEqual('titleCase')
  })

  it('should convert lower-case to camel-case', () => {
    const result = toCamelCase('lower case')
    expect(result).toEqual('lowerCase')
  })

  it('should convert multiple strings to camel-case', () => {
    const result = toCamelCase('foo', 'bar', 'baz')
    expect(result).toEqual('fooBarBaz')
  })
}
