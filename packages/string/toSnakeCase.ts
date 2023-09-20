import { tokenize } from './tokenize'

/**
 * Convert a string to snake case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to snake case.
 * @example toSnakeCase('FOO_BAR', 'Baz') // 'foo_bar_baz'
 */
export function toSnakeCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.toLowerCase())
    .join('_')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to snake-case', () => {
    const result = toSnakeCase('camelCase')
    expect(result).toEqual('camel_case')
  })

  it('should convert constant-case to snake-case', () => {
    const result = toSnakeCase('CONSTANT_CASE')
    expect(result).toEqual('constant_case')
  })

  it('should convert dot-case to snake-case', () => {
    const result = toSnakeCase('dot.case')
    expect(result).toEqual('dot_case')
  })

  it('should convert header-case to snake-case', () => {
    const result = toSnakeCase('Header-Case')
    expect(result).toEqual('header_case')
  })

  it('should convert kebab-case to snake-case', () => {
    const result = toSnakeCase('kebab-case')
    expect(result).toEqual('kebab_case')
  })

  it('should convert pascal-case to snake-case', () => {
    const result = toSnakeCase('PascalCase')
    expect(result).toEqual('pascal_case')
  })

  it('should convert path-case to snake-case', () => {
    const result = toSnakeCase('path/case')
    expect(result).toEqual('path_case')
  })

  it('should convert snake_case to snake-case', () => {
    const result = toSnakeCase('snake_case')
    expect(result).toEqual('snake_case')
  })

  it('should convert title-case to snake-case', () => {
    const result = toSnakeCase('Title Case')
    expect(result).toEqual('title_case')
  })

  it('should convert lower-case to snake-case', () => {
    const result = toSnakeCase('lower case')
    expect(result).toEqual('lower_case')
  })

  it('should convert multiple strings to snake-case', () => {
    const result = toSnakeCase('foo', 'bar', 'baz')
    expect(result).toEqual('foo_bar_baz')
  })
}
