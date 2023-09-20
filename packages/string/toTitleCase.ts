import { tokenize } from './tokenize'

/**
 * Convert a string to title case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to title case.
 * @example toTitleCase('FOO_BAR', 'Baz') // 'Foo Bar Baz'
 */
export function toTitleCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to title-case', () => {
    const result = toTitleCase('camelCase')
    expect(result).toEqual('Camel Case')
  })

  it('should convert constant-case to title-case', () => {
    const result = toTitleCase('CONSTANT_CASE')
    expect(result).toEqual('Constant Case')
  })

  it('should convert dot-case to title-case', () => {
    const result = toTitleCase('dot.case')
    expect(result).toEqual('Dot Case')
  })

  it('should convert header-case to title-case', () => {
    const result = toTitleCase('Header-Case')
    expect(result).toEqual('Header Case')
  })

  it('should convert kebab-case to title-case', () => {
    const result = toTitleCase('kebab-case')
    expect(result).toEqual('Kebab Case')
  })

  it('should convert pascal-case to title-case', () => {
    const result = toTitleCase('PascalCase')
    expect(result).toEqual('Pascal Case')
  })

  it('should convert path-case to title-case', () => {
    const result = toTitleCase('path/case')
    expect(result).toEqual('Path Case')
  })

  it('should convert snake_case to title-case', () => {
    const result = toTitleCase('snake_case')
    expect(result).toEqual('Snake Case')
  })

  it('should convert title-case to title-case', () => {
    const result = toTitleCase('Title Case')
    expect(result).toEqual('Title Case')
  })

  it('should convert lower-case to title-case', () => {
    const result = toTitleCase('lower case')
    expect(result).toEqual('Lower Case')
  })

  it('should convert multiple strings to title-case', () => {
    const result = toTitleCase('foo', 'bar', 'baz')
    expect(result).toEqual('Foo Bar Baz')
  })
}
