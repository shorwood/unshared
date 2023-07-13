import { semverParse } from './semverParse'

/**
 * Checks if a string is a valid semver.
 *
 * @param version The version to check.
 * @returns `true` if the version is a valid semver.
 * @example isStringSemver('1.2.3') // true
 */
export function isStringSemver(version: string): boolean {
  try {
    semverParse(version)
    return true
  }
  catch { return false }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return true for a valid semver', () => {
    const result = isStringSemver('1.2.3')
    expect(result).toEqual(true)
  })

  it('should return false for an invalid semver', () => {
    const result = isStringSemver('not-a-semver')
    expect(result).toEqual(false)
  })
}
