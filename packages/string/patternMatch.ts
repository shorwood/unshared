import { patternRegex } from './patternRegex'

/**
 * Returns `true` if the given string matches the given glob pattern.
 *
 * @param string The string to match.
 * @param pattern The glob pattern to match against.
 * @returns `true` if the string matches the pattern.
 * @example patternMatch('Foo', '[fF]o*') // true
 */
export function patternMatch(string: string, pattern: string): boolean {
  return patternRegex(pattern).test(string)
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should match a string by pattern', () => {
    const result = patternMatch('foo', 'fo*')
    expect(result).toEqual(true)
  })
}
