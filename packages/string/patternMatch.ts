import { createPatternRegexp } from './createPatternRegexp'

/**
 * Returns `true` if the given string matches the given glob pattern.
 *
 * @param pattern The glob pattern to match against.
 * @param match The string to match against the pattern.
 * @returns `true` if the string matches the pattern.
 * @example patternMatch('{f,F}o*', 'Foo') // true
 */
export function patternMatch(pattern: string, match: string): boolean {
  return createPatternRegexp(pattern).test(match)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should match a string by pattern', () => {
    const result = patternMatch('{f,F}o*', 'Foo')
    expect(result).toEqual(true)
  })
}
