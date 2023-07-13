import { patternRegex } from './patternRegex'

/**
 * Filter a list of strings by a pattern.
 *
 * @param list The list of strings to filter.
 * @param pattern The pattern to filter by.
 * @returns The filtered list.
 * @example patternMatches(['Foo', 'Bar', 'baz'], '[bB]a*') // ['Bar', 'Baz']
 */
export function patternMatches(list: string[], pattern: string): string[] {
  const regex = patternRegex(pattern)
  return list.filter(item => regex.test(item))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should filter list by pattern', () => {
    const result = patternMatches(['foo', 'bar', 'baz'], 'ba*')
    expect(result).toEqual(['bar', 'baz'])
  })
}
