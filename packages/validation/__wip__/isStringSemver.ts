import { SEMVER_REGEXP } from '@unshared/string/createSemver'

/**
 * Check if string matches [Semantic Versioning](https://semver.org/) version.
 *
 * @param value The value to check.
 * @returns `true` if string matches a Semantic Versioning version, `false` otherwise
 * @example isStringSemver('1.0.0-rc.3') // true
 */
export function isStringSemver(value: unknown): boolean {
  return typeof value === 'string' && SEMVER_REGEXP.test(value)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return true for a valid semver', () => {
    const result = isStringSemver('1.0.0-rc.3')
    expect(result).toBeTruthy()
  })

  test('should return false for an invalid semver', () => {
    const result = isStringSemver('1.0.a')
    expect(result).toBeFalsy()
  })
}
