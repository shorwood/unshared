export interface Semver {
  /**
   * The major version number. This number is incremented when a new version
   * contains breaking changes.
   *
   * @example 1
   */
  major: number
  /**
   * The minor version number. This number is incremented when a new version
   * contains new features. This number is reset to 0 when the major version
   * number is incremented.
   *
   * @example 2
   */
  minor: number
  /**
   * The patch version number. This number is incremented when a new version
   * contains bug fixes. This number is reset to 0 when the minor or major
   * version number is incremented.
   *
   * @example 3
   */
  patch: number
  /**
   * The prerelease version number. Prerelease versions are not considered
   * stable and may contain bugs. This number is incremented when a new version
   * contains bug fixes. This number is reset to 0 when the minor or major
   * version number is incremented.
   *
   * @example 'alpha.0'
   */
  prerelease?: string
  /**
   * The build version number. Build versions are used to identify the build
   * number of a version. This number is incremented when a new version
   * contains bug fixes. This number is reset to 0 when the minor or major
   * version number is incremented.
   *
   * @example 'build.0'
   */
  build?: string
}

/**
 * Create a semver object.
 *
 * @param semver The semver object.
 * @returns The semver object.
 * @example createSemver({ major: 1, ... }) // { major: 1, minor: 0, patch: 0, prerelease: undefined, build: undefined }
 */
export function createSemver(semver: Partial<Semver> = {}): Semver {
  const { major = 0, minor = 0, patch = 0, prerelease, build } = semver
  return { major, minor, patch, prerelease, build }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a semver object with default values', () => {
    const result = createSemver()
    expect(result).toEqual({
      major: 0,
      minor: 0,
      patch: 0,
      prerelease: undefined,
      build: undefined,
    })
  })

  it('should create a semver object with custom values', () => {
    const result = createSemver({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'alpha',
      build: 'build',
    })
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'alpha',
      build: 'build',
    })
  })
}
