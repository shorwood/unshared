import { tokenize } from './tokenize'

/**
 * Convert a string to dot case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to dot case.
 * @example toDotCase('FOO_BAR', 'Baz') // 'foo.bar.baz'
 */
export function toDotCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.toLowerCase())
    .join('.')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to dot-case', () => {
    const result = toDotCase('camelCase')
    expect(result).toEqual('camel.case')
  })

  it('should convert constant-case to dot-case', () => {
    const result = toDotCase('CONSTANT_CASE')
    expect(result).toEqual('constant.case')
  })

  it('should convert dot-case to dot-case', () => {
    const result = toDotCase('dot.case')
    expect(result).toEqual('dot.case')
  })

  it('should convert header-case to dot-case', () => {
    const result = toDotCase('Header-Case')
    expect(result).toEqual('header.case')
  })

  it('should convert kebab-case to dot-case', () => {
    const result = toDotCase('kebab-case')
    expect(result).toEqual('kebab.case')
  })

  it('should convert pascal-case to dot-case', () => {
    const result = toDotCase('PascalCase')
    expect(result).toEqual('pascal.case')
  })

  it('should convert path-case to dot-case', () => {
    const result = toDotCase('path/case')
    expect(result).toEqual('path.case')
  })

  it('should convert snake_case to dot-case', () => {
    const result = toDotCase('snake_case')
    expect(result).toEqual('snake.case')
  })

  it('should convert title-case to dot-case', () => {
    const result = toDotCase('Title Case')
    expect(result).toEqual('title.case')
  })

  it('should convert lower-case to dot-case', () => {
    const result = toDotCase('lower case')
    expect(result).toEqual('lower.case')
  })

  it('should convert multiple strings to dot-case', () => {
    const result = toDotCase('foo', 'bar', 'baz')
    expect(result).toEqual('foo.bar.baz')
  })
}
