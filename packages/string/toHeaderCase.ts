import { tokenize } from './tokenize'

/**
 * Convert a string to header case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to header case.
 * @example toHeaderCase('FOO_BAR', 'Baz') // 'Foo-Bar-Baz'
 */
export function toHeaderCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join('-')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to header-case', () => {
    const result = toHeaderCase('camelCase')
    expect(result).toEqual('Camel-Case')
  })

  it('should convert constant-case to header-case', () => {
    const result = toHeaderCase('CONSTANT_CASE')
    expect(result).toEqual('Constant-Case')
  })

  it('should convert dot-case to header-case', () => {
    const result = toHeaderCase('dot.case')
    expect(result).toEqual('Dot-Case')
  })

  it('should convert header-case to header-case', () => {
    const result = toHeaderCase('Header-Case')
    expect(result).toEqual('Header-Case')
  })

  it('should convert kebab-case to header-case', () => {
    const result = toHeaderCase('kebab-case')
    expect(result).toEqual('Kebab-Case')
  })

  it('should convert pascal-case to header-case', () => {
    const result = toHeaderCase('PascalCase')
    expect(result).toEqual('Pascal-Case')
  })

  it('should convert path-case to header-case', () => {
    const result = toHeaderCase('path/case')
    expect(result).toEqual('Path-Case')
  })

  it('should convert snake_case to header-case', () => {
    const result = toHeaderCase('snake_case')
    expect(result).toEqual('Snake-Case')
  })

  it('should convert title-case to header-case', () => {
    const result = toHeaderCase('Title Case')
    expect(result).toEqual('Title-Case')
  })

  it('should convert lower-case to header-case', () => {
    const result = toHeaderCase('lower case')
    expect(result).toEqual('Lower-Case')
  })

  it('should convert multiple strings to header-case', () => {
    const result = toHeaderCase('foo', 'bar', 'baz')
    expect(result).toEqual('Foo-Bar-Baz')
  })
}
