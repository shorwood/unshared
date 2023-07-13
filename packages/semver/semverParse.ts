import { Semver } from './createSemver'

/**
 * Parse a semver string into a [Semver](https://en.wikipedia.org/wiki/Software_versioning) object.
 *
 * @param version The semver string to parse.
 * @returns An object containing the major, minor, patch, prerelease and build versions.
 * @example parseSemver('1.2.3-alpha+build') // { major: 1, minor: 2, patch: 3, prerelease: 'alpha', build: 'build' }
 */
export function semverParse(version: string): Semver {
  const [major, minor, patch] = version.split('.').map(x => Number.parseInt(x, 10))

  // --- Validate the components
  if (major < 0 || major > Number.MAX_SAFE_INTEGER || Number.isNaN(major)) throw new RangeError('Invalid major version')
  if (minor < 0 || minor > Number.MAX_SAFE_INTEGER || Number.isNaN(minor)) throw new RangeError('Invalid minor version')
  if (patch < 0 || patch > Number.MAX_SAFE_INTEGER || Number.isNaN(patch)) throw new RangeError('Invalid patch version')

  const prerelease = version.match(/-([^+-]+)/)?.[1]
  const build = version.match(/\+([^+-]+)/)?.[1]
  return { major, minor, patch, prerelease, build }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should parse a simple semver', () => {
    const result = semverParse('1.2.3')
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: undefined,
      build: undefined,
    })
  })

  it('should parse a semver with prerelease', () => {
    const result = semverParse('1.2.3-alpha')
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'alpha',
      build: undefined,
    })
  })

  it('should parse a semver with build', () => {
    const result = semverParse('1.2.3+build')
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: undefined,
      build: 'build',
    })
  })

  it('should parse a semver with prerelease and build', () => {
    const result = semverParse('1.2.3-alpha+build')
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'alpha',
      build: 'build',
    })
  })

  it('should throw an error if the version is not a semver', () => {
    const shouldThrow = () => semverParse('not-a-semver')
    expect(shouldThrow).toThrowError(RangeError)
  })
}
