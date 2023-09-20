import { tokenize } from './tokenize'

/**
 * Convert a string to path case.
 *
 * @param values The string(s) to convert.
 * @returns The converted string to path case.
 * @example toPathCase('FOO_BAR', 'Baz') // 'foo/bar/baz'
 */
export function toPathCase(...values: string[]): string {
  return values
    .flatMap(tokenize)
    .map(token => token.toLowerCase())
    .join('/')
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should convert camel-case to path-case', () => {
    const result = toPathCase('camelCase')
    expect(result).toEqual('camel/case')
  })

  it('should convert constant-case to path-case', () => {
    const result = toPathCase('CONSTANT_CASE')
    expect(result).toEqual('constant/case')
  })

  it('should convert dot-case to path-case', () => {
    const result = toPathCase('dot.case')
    expect(result).toEqual('dot/case')
  })

  it('should convert header-case to path-case', () => {
    const result = toPathCase('Header-Case')
    expect(result).toEqual('header/case')
  })

  it('should convert kebab-case to path-case', () => {
    const result = toPathCase('kebab-case')
    expect(result).toEqual('kebab/case')
  })

  it('should convert pascal-case to path-case', () => {
    const result = toPathCase('PascalCase')
    expect(result).toEqual('pascal/case')
  })

  it('should convert path-case to path-case', () => {
    const result = toPathCase('path/case')
    expect(result).toEqual('path/case')
  })

  it('should convert snake_case to path-case', () => {
    const result = toPathCase('snake_case')
    expect(result).toEqual('snake/case')
  })

  it('should convert title-case to path-case', () => {
    const result = toPathCase('Title Case')
    expect(result).toEqual('title/case')
  })

  it('should convert lower-case to path-case', () => {
    const result = toPathCase('lower case')
    expect(result).toEqual('lower/case')
  })

  it('should convert multiple strings to path-case', () => {
    const result = toPathCase('foo', 'bar', 'baz')
    expect(result).toEqual('foo/bar/baz')
  })
}
