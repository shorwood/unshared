import { tokenize } from './tokenize'

/**
 * Convert a string to pascal case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to pascal case.
 * @example toConstantCase('FOO_BAR', 'Baz') // 'FooBarBaz'
 */
export function toPascalCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join('')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to pascal-case', () => {
    const result = toPascalCase('camelCase')
    expect(result).toEqual('CamelCase')
  })

  it('should convert constant-case to pascal-case', () => {
    const result = toPascalCase('CONSTANT_CASE')
    expect(result).toEqual('ConstantCase')
  })

  it('should convert dot-case to pascal-case', () => {
    const result = toPascalCase('dot.case')
    expect(result).toEqual('DotCase')
  })

  it('should convert header-case to pascal-case', () => {
    const result = toPascalCase('Header-Case')
    expect(result).toEqual('HeaderCase')
  })

  it('should convert kebab-case to pascal-case', () => {
    const result = toPascalCase('kebab-case')
    expect(result).toEqual('KebabCase')
  })

  it('should convert pascal-case to pascal-case', () => {
    const result = toPascalCase('PascalCase')
    expect(result).toEqual('PascalCase')
  })

  it('should convert path-case to pascal-case', () => {
    const result = toPascalCase('path/case')
    expect(result).toEqual('PathCase')
  })

  it('should convert snake_case to pascal-case', () => {
    const result = toPascalCase('snake_case')
    expect(result).toEqual('SnakeCase')
  })

  it('should convert title-case to pascal-case', () => {
    const result = toPascalCase('Title Case')
    expect(result).toEqual('TitleCase')
  })

  it('should convert multiple strings to pascal-case', () => {
    const result = toPascalCase('foo', 'bar', 'baz')
    expect(result).toEqual('FooBarBaz')
  })
}
