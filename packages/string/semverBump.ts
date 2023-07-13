import { Semver } from './createSemver'

/**
 * The components of a sementic version.
 */
export type SemverComponent = keyof Semver

/**
 * Bump the last digits of a prerelease or build component.
 *
 * @param value The component to bump.
 * @returns The bumped component.
 * @example bumpLastDigit('alpha.1') // 'alpha.2'
 */
function bumpLastDigit(value = ''): string {
  const regexp = /(\d+)$/
  return regexp.test(value)
    ? value.replace(regexp, (match, number) => {
      const newNumber = Number.parseInt(number, 10) + 1
      return newNumber.toString()
    })
    : `${value}.0`
}

/**
 * Bump one of the components of a semver version.
 *
 * @param semver The semver version.
 * @param component The component to bump.
 * @returns The bumped semver version.
 * @example
 * semverBump({ ..., patch: 3 }, 'patch') // { ..., patch: 4 }
 */
export function semverBump(semver: Semver, component: SemverComponent): Semver {
  let { major, minor, patch, prerelease, build } = semver

  // --- Bump the component.
  if (component === 'major') { major += 1; minor = 0; patch = 0; prerelease = undefined; build = undefined }
  if (component === 'minor') { minor += 1; patch = 0; prerelease = undefined; build = undefined }
  if (component === 'patch') { patch += 1; prerelease = undefined; build = undefined }
  if (component === 'prerelease') prerelease = bumpLastDigit(prerelease)
  if (component === 'build') build = bumpLastDigit(build)

  // --- Return the bumped semver.
  return { major, minor, patch, prerelease, build }
}

/* c8 ignore next */
if (import.meta.vitest) {
  const semver = { major: 1, minor: 2, patch: 3, prerelease: 'alpha.0', build: 'build.0' }

  it('should bump the major version', () => {
    const result = semverBump(semver, 'major')
    expect(result).toEqual({ major: 2, minor: 0, patch: 0, prerelease: undefined, build: undefined })
  })

  it('should bump the minor version', () => {
    const result = semverBump(semver, 'minor')
    expect(result).toEqual({ major: 1, minor: 3, patch: 0, prerelease: undefined, build: undefined })
  })

  it('should bump the patch version', () => {
    const result = semverBump(semver, 'patch')
    expect(result).toEqual({ major: 1, minor: 2, patch: 4, prerelease: undefined, build: undefined })
  })

  it('should bump the prerelease version', () => {
    const result = semverBump(semver, 'prerelease')
    expect(result).toEqual({ major: 1, minor: 2, patch: 3, prerelease: 'alpha.1', build: 'build.0' })
  })

  it('should bump the build version', () => {
    const result = semverBump(semver, 'build')
    expect(result).toEqual({ major: 1, minor: 2, patch: 3, prerelease: 'alpha.0', build: 'build.1' })
  })

  it('should bump the prerelease version when it is undefined', () => {
    const result = semverBump({ ...semver, prerelease: undefined }, 'prerelease')
    expect(result).toEqual({ major: 1, minor: 2, patch: 3, prerelease: 'prerelease.0', build: 'build.0' })
  })

  it('should bump the build version when it is undefined', () => {
    const result = semverBump({ ...semver, build: undefined }, 'build')
    expect(result).toEqual({ major: 1, minor: 2, patch: 3, prerelease: 'alpha.0', build: 'build.0' })
  })

  it('should bump the prerelease version when it has no digits', () => {
    const result = semverBump({ ...semver, prerelease: 'alpha' }, 'prerelease')
    expect(result).toEqual({ major: 1, minor: 2, patch: 3, prerelease: 'alpha.0', build: 'build.0' })
  })

  it('should bump the build version when it has no digits', () => {
    const result = semverBump({ ...semver, build: 'build' }, 'build')
    expect(result).toEqual({ major: 1, minor: 2, patch: 3, prerelease: 'alpha.0', build: 'build.0' })
  })
}
