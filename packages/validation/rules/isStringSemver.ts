import { semverRegExp } from '@unshared/string'

/**
 * Check if string matches [Semantic Versioning](https://semver.org/) version.
 *
 * @param value The value to check.
 * @returns `true` if string matches a Semantic Versioning version, `false` otherwise
 * @example
 * isStringSemver('1.0.0-rc.3') // true
 * isStringSemver('1.0.a') // false
 * isStringSemver('1.0') // false
 */
export function isStringSemver(value: string): boolean {
  return semverRegExp.test(value)
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true for a valid semver', () => {
    const result = isStringSemver('1.0.0-rc.3')
    expect(result).toEqual(true)
  })

  it('should return false for an invalid semver', () => {
    const result = isStringSemver('1.0.a')
    expect(result).toEqual(false)
  })
}
