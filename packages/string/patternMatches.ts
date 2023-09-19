import { createPatternRegexp } from './createPatternRegexp'

/**
 * Filter a list of strings by a pattern.
 *
 * @param pattern The pattern to filter by.
 * @param matches The strings to match against the pattern.
 * @returns The filtered list.
 * @example patternMatches('{foo,bar}', ['foo', 'bar', 'baz']) // => ['foo', 'bar']
 */
export function patternMatches(pattern: string, matches: string[]): string[] {
  const regex = createPatternRegexp(pattern)
  return matches.filter(x => regex.test(x))
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should filter list by pattern', () => {
    const result = patternMatches('{foo,bar}', ['foo', 'bar', 'baz'])
    expect(result).toEqual(['foo', 'bar'])
  })
}
