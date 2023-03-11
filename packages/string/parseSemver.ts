export interface Semver {
  major: number
  minor: number
  patch: number
  prerelease: string
  build: string
}

/**
 * Parse a semver string into a [Semver](https://en.wikipedia.org/wiki/Software_versioning) object.
 *
 * @param version The semver string to parse.
 * @throws If the version is not a valid semver.
 * @returns A Semver object.
 */
export function parseSemver(version: string): Semver {
  if (typeof version !== 'string')
    throw new TypeError('Expected the version to be a string')

  // --- Split the version into parts
  const [major, minor, patch] = version
    .split('.')
    .map(part => Number.parseInt(part, 10))

  // --- Parse the prerelease and build
  const prerelease = version.split('-')[1]
  const build = version.split('+')[1]

  // --- Assert the parts are numbers
  if (Number.isInteger(major) === false)
    throw new SyntaxError('Expected the major version to be a number')
  if (Number.isInteger(minor) === false)
    throw new SyntaxError('Expected the minor version to be a number')
  if (Number.isInteger(patch) === false)
    throw new SyntaxError('Expected the patch version to be a number')

  // --- Return the semver
  return { major, minor, patch, prerelease, build }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should parse a simple semver', () => {
    const result = parseSemver('1.2.3')
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: undefined,
      build: undefined,
    })
  })

  it('should parse a semver with prerelease', () => {
    const result = parseSemver('1.2.3-alpha.1')
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'alpha.1',
      build: undefined,
    })
  })

  it('should parse a semver with build', () => {
    const result = parseSemver('1.2.3+build.1')
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: undefined,
      build: 'build.1',
    })
  })

  it('should parse a semver with prerelease and build', () => {
    const result = parseSemver('1.2.3-alpha.1+build.1')
    expect(result).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: 'alpha.1',
      build: 'build.1',
    })
  })

  it('should throw an error if the version is not a string', () => {
    // @ts-expect-error: invalid parameter type
    const shouldThrow = () => parseSemver(123)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the major version is not a number', () => {
    const shouldThrow = () => parseSemver('a.2.3')
    expect(shouldThrow).toThrowError(SyntaxError)
  })

  it('should throw an error if the minor version is not a number', () => {
    const shouldThrow = () => parseSemver('1.b.3')
    expect(shouldThrow).toThrowError(SyntaxError)
  })

  it('should throw an error if the patch version is not a number', () => {
    const shouldThrow = () => parseSemver('1.2.c')
    expect(shouldThrow).toThrowError(SyntaxError)
  })

  it('should throw an error if the version is not a semver', () => {
    const shouldThrow = () => parseSemver('1.2')
    expect(shouldThrow).toThrowError(SyntaxError)
  })

  it('should throw an error if the version is not a semver', () => {
    const shouldThrow = () => parseSemver('hello')
    expect(shouldThrow).toThrowError(SyntaxError)
  })
}
