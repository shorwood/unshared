import { tokenize } from './tokenize'

/**
 * Convert a string to constant case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to constant case.
 * @example toConstantCase('FOO_BAR', 'Baz') // 'FOO_BAR_BAZ'
 */
export function toConstantCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.toUpperCase())
    .join('_')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to constant-case', () => {
    const result = toConstantCase('camelCase')
    expect(result).toEqual('CAMEL_CASE')
  })

  it('should convert constant-case to constant-case', () => {
    const result = toConstantCase('CONSTANT_CASE')
    expect(result).toEqual('CONSTANT_CASE')
  })

  it('should convert dot-case to constant-case', () => {
    const result = toConstantCase('dot.case')
    expect(result).toEqual('DOT_CASE')
  })

  it('should convert header-case to constant-case', () => {
    const result = toConstantCase('Header-Case')
    expect(result).toEqual('HEADER_CASE')
  })

  it('should convert kebab-case to constant-case', () => {
    const result = toConstantCase('kebab-case')
    expect(result).toEqual('KEBAB_CASE')
  })

  it('should convert pascal-case to constant-case', () => {
    const result = toConstantCase('PascalCase')
    expect(result).toEqual('PASCAL_CASE')
  })

  it('should convert path-case to constant-case', () => {
    const result = toConstantCase('path/case')
    expect(result).toEqual('PATH_CASE')
  })

  it('should convert snake_case to constant-case', () => {
    const result = toConstantCase('snake_case')
    expect(result).toEqual('SNAKE_CASE')
  })

  it('should convert title-case to constant-case', () => {
    const result = toConstantCase('Title Case')
    expect(result).toEqual('TITLE_CASE')
  })

  it('should convert lower-case to constant-case', () => {
    const result = toConstantCase('lower case')
    expect(result).toEqual('LOWER_CASE')
  })

  it('should convert multiple strings to constantcamel-case', () => {
    const result = toConstantCase('foo', 'bar', 'baz')
    expect(result).toEqual('FOO_BAR_BAZ')
  })
}
