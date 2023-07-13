import { Semver } from './createSemver'

/**
 * Stringify a semver version.
 *
 * @param semver The semver version.
 * @returns The stringified version.
 * @example semverStringify({ major: 1, minor: 2, patch: 3, prerelease: 'alpha', build: 'build' }) // '1.2.3-alpha+build'
 */
export function semverStringify(semver: Semver): string {
  const { major, minor, patch, prerelease, build } = semver
  const version = `${major}.${minor}.${patch}`
  const prereleaseString = prerelease ? `-${prerelease}` : ''
  const buildString = build ? `+${build}` : ''
  return `${version}${prereleaseString}${buildString}`
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should stringify a semver version', () => {
    const semver = { major: 1, minor: 2, patch: 3, prerelease: 'alpha', build: 'build' }
    const result = semverStringify(semver)
    expect(result).toEqual('1.2.3-alpha+build')
  })

  it('should stringify a semver version without prerelease', () => {
    const semver = { major: 1, minor: 2, patch: 3, prerelease: undefined, build: 'build' }
    const result = semverStringify(semver)
    expect(result).toEqual('1.2.3+build')
  })

  it('should stringify a semver version without build', () => {
    const semver = { major: 1, minor: 2, patch: 3, prerelease: 'alpha', build: undefined }
    const result = semverStringify(semver)
    expect(result).toEqual('1.2.3-alpha')
  })

  it('should stringify a semver version without prerelease and build', () => {
    const semver = { major: 1, minor: 2, patch: 3, prerelease: undefined, build: undefined }
    const result = semverStringify(semver)
    expect(result).toEqual('1.2.3')
  })
}
