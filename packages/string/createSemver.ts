/**
 * Sementic Versioning RegExp as recommended by the [official website](https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string).
 */
// eslint-disable-next-line unicorn/no-unsafe-regex
const semverRegExp = /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*))*))?(?:\+(?<buildmetadata>[\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/

/**
 * A class that represents a Sementic Version. This class is meant to be used
 * as a type-safe alternative to the native `string` type for representing
 * versions.
 */
export class Semver {
  /**
   * Create a new `Semver` instance from the given semver object.
   *
   * @param semver A object that defines the components of a sementic version.
   * @example new Semver({ major: 1 }) // '1.0.0'
   */
  constructor(semver: Partial<Semver> = {}) {
    if (semver.major !== undefined) this.major = semver.major
    if (semver.minor !== undefined) this.minor = semver.minor
    if (semver.patch !== undefined) this.patch = semver.patch
    if (semver.prerelease !== undefined) this.prerelease = semver.prerelease
    if (semver.build !== undefined) this.build = semver.build
  }

  /**
   * The major version number. This number is incremented when a new version
   * contains breaking changes.
   *
   * @default 0
   */
  major = 0

  /**
   * The minor version number. This number is incremented when a new version
   * contains new features. This number is reset to 0 when the major version
   * number is incremented.
   *
   * @default 0
   */
  minor = 0

  /**
   * The patch version number. This number is incremented when a new version
   * contains bug fixes. This number is reset to 0 when the minor or major
   * version number is incremented.
   *
   * @default 0
   */
  patch = 0

  /**
   * The prerelease version number. Prerelease versions are not considered
   * stable and may contain bugs. This number is incremented when a new version
   * contains bug fixes. This number is reset to 0 when the minor or major
   * version number is incremented.
   *
   * @example 'alpha.0'
   */
  prerelease?: string = undefined

  /**
   * The build version number. Build versions are used to identify the build
   * number of a version. This number is incremented when a new version
   * contains bug fixes. This number is reset to 0 when the minor or major
   * version number is incremented.
   *
   * @example 'build.0'
   */
  build?: string = undefined

  /**
   * Parse a semver string into a [Semver](https://en.wikipedia.org/wiki/Software_versioning) object.
   *
   * @param version The semver string to parse.
   * @returns An object containing the major, minor, patch, prerelease and build versions.
   * @example Semver.parse('1.2.3-alpha+build') // Semver { ... }
   */
  static parse(version: string): Semver {
    const match = version.match(semverRegExp)
    if (!match) throw new Error(`Invalid semver version: ${version}`)
    return new Semver({
      major: Number.parseInt(match.groups!.major, 10),
      minor: Number.parseInt(match.groups!.minor, 10),
      patch: Number.parseInt(match.groups!.patch, 10),
      prerelease: match.groups!.prerelease,
      build: match.groups!.buildmetadata,
    })
  }

  /**
   * Bump one of the components of a semver version. This method returns a new
   * `Semver` instance with the bumped component.
   *
   * @param component The component to bump.
   * @returns The bumped semver version.
   * @example new Semver({ major: 1 }).bump('minor') // Semver { major: 1, minor: 1, patch: 0 }
   */
  bump(component: 'major' | 'minor' | 'patch'): Semver {
    let { major, minor, patch, prerelease, build } = this

    // --- Bump the component.
    if (component === 'major') { major += 1; minor = 0; patch = 0; prerelease = undefined; build = undefined }
    if (component === 'minor') { minor += 1; patch = 0; prerelease = undefined; build = undefined }
    if (component === 'patch') { patch += 1; prerelease = undefined; build = undefined }

    // --- Return the bumped semver.
    return new Semver({ major, minor, patch, prerelease, build })
  }

  /**
   * Return a string representation of the Sementic Version.
   *
   * @returns A string representation of the Sementic Version.
   * @example new Semver({ major: 1 }).stringify() // '1.0.0'
   */
  toString(): string {
    const { major, minor, patch, prerelease, build } = this
    const version = `${major}.${minor}.${patch}`
    const prereleaseString = prerelease ? `-${prerelease}` : ''
    const buildString = build ? `+${build}` : ''
    return `${version}${prereleaseString}${buildString}`
  }

  /**
   * Check if the given semver version satisfies the current semver range as defined by
   * the [RFC 2119](https://tools.ietf.org/html/rfc2119) specification.
   *
   * @param range The semver range to check.
   * @returns `true` if the given semver version satisfies the current semver range, otherwise `false`.
   * @example new Semver({ major: 1 }).satisfies('>=1.0.0') // true
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  satisfies(range: string): boolean {
    // --- Get the comparaison operator and the version to compare.
    const rangeMatch = range.match(/^(>=|<=|>|<|=|\^|~)?\s*(.*)$/) as RegExpMatchArray
    if (!rangeMatch) throw new Error(`Invalid semver range: ${range}`)

    // --- Get the comparaison operator and the version to compare.
    const [, operator, version] = rangeMatch
    const rangeSemver = Semver.parse(version)
    const { major, minor, patch } = this

    // --- Check if the Semver is strictly greater than the range Semver.
    if (operator === '>') {
      return (major > rangeSemver.major)
          || (major === rangeSemver.major && minor > rangeSemver.minor)
          || (major === rangeSemver.major && minor === rangeSemver.minor && patch > rangeSemver.patch)
    }

    // --- Check if the Semver is strictly lower than the range Semver.
    if (operator === '<') {
      return (major < rangeSemver.major)
          || (major === rangeSemver.major && minor < rangeSemver.minor)
          || (major === rangeSemver.major && minor === rangeSemver.minor && patch < rangeSemver.patch)
    }

    // --- Check if the Semver is greater than or equal to the range Semver.
    if (operator === '<=') {
      return (major < rangeSemver.major)
          || (major === rangeSemver.major && minor < rangeSemver.minor)
          || (major === rangeSemver.major && minor === rangeSemver.minor && patch <= rangeSemver.patch)
    }

    // --- Check if the Semver is lower than or equal to the range Semver.
    if (operator === '>=') return major >= rangeSemver.major && minor >= rangeSemver.minor && patch >= rangeSemver.patch

    // --- Check if the major version is compatible with the range Semver.
    if (operator === '^') return major === rangeSemver.major && minor >= rangeSemver.minor && patch >= rangeSemver.patch

    // --- Check if the minor version is compatible with the range Semver.
    if (operator === '~') return major === rangeSemver.major && minor === rangeSemver.minor && patch >= rangeSemver.patch

    // --- Check if the Semver is equal to the range Semver.
    if (operator === '=' || !operator) return major === rangeSemver.major && minor === rangeSemver.minor && patch === rangeSemver.patch

    // --- Temporary return `true`.
    return true
  }
}

/**
 * Create a semver instance from the given semver components or semver string.
 *
 * @param semver A semver string or object that defines the components of a sementic version.
 * @returns A semver instance.
 * @example createSemver('1.2.3-alpha+build') // Semver { ... }
 */
export function createSemver(semver?: string | Partial<Semver>): Semver {
  return typeof semver === 'string' ? Semver.parse(semver) : new Semver(semver)
}

/* c8 ignore next */
if (import.meta.vitest) {
  const semverString = '1.2.3-alpha4+build5'
  const semverObject = { major: 1, minor: 2, patch: 3, prerelease: 'alpha4', build: 'build5' }

  it('should create a Semver instance with default values', () => {
    const version = createSemver()
    const expected = new Semver({ major: 0, minor: 0, patch: 0, prerelease: undefined, build: undefined })
    expect(version).toEqual(expected)
  })

  it('should create a Semver instance from the given object', () => {
    const version = createSemver(semverObject)
    expect(version).toEqual(semverObject)
  })

  it('should create a Semver instance from parsing the given string', () => {
    const version = createSemver(semverString)
    expect(version).toEqual(semverObject)
  })

  it('should throw an error when parsing an invalid semver string', () => {
    const shouldThrow = () => createSemver('invalid')
    expect(shouldThrow).toThrowError()
  })

  it('should bump the major component', () => {
    const version = createSemver(semverString).bump('major')
    expect(version).toEqual({ major: 2, minor: 0, patch: 0, prerelease: undefined, build: undefined })
  })

  it('should bump the minor component', () => {
    const version = createSemver(semverString).bump('minor')
    expect(version).toEqual({ major: 1, minor: 3, patch: 0, prerelease: undefined, build: undefined })
  })

  it('should bump the patch component', () => {
    const version = createSemver(semverString).bump('patch')
    expect(version).toEqual({ major: 1, minor: 2, patch: 4, prerelease: undefined, build: undefined })
  })

  it('should stringify the semver', () => {
    const version = createSemver(semverString).toString()
    expect(version).toEqual(semverString)
  })

  it('should implicitly stringify the semver', () => {
    const version = `${createSemver(semverString)}`
    expect(version).toEqual(semverString)
  })

  it.each([
    // --- Operator ">="
    ['1.0.0', '>=1.0.0', true],
    ['1.0.1', '>=1.0.0', true],
    ['1.1.0', '>=1.0.0', true],
    ['2.0.0', '>=1.0.0', true],
    ['0.9.9', '>=1.0.0', false],
    ['0.0.0', '>=1.0.0', false],

    // --- Operator ">"
    ['1.0.0', '>1.0.0', false],
    ['1.0.1', '>1.0.0', true],
    ['1.1.0', '>1.0.0', true],
    ['2.0.0', '>1.0.0', true],
    ['0.9.9', '>1.0.0', false],
    ['0.0.0', '>1.0.0', false],

    // --- Operator "<="
    ['1.0.0', '<=1.0.0', true],
    ['1.0.1', '<=1.0.0', false],
    ['1.1.0', '<=1.0.0', false],
    ['2.0.0', '<=1.0.0', false],
    ['0.9.9', '<=1.0.0', true],
    ['0.0.0', '<=1.0.0', true],

    // --- Operator "<"
    ['1.0.0', '<1.0.0', false],
    ['1.0.1', '<1.0.0', false],
    ['1.1.0', '<1.0.0', false],
    ['2.0.0', '<1.0.0', false],
    ['0.9.9', '<1.0.0', true],
    ['0.0.0', '<1.0.0', true],

    // --- Operator "="
    ['1.0.0', '=1.0.0', true],
    ['1.0.1', '=1.0.0', false],
    ['1.1.0', '=1.0.0', false],
    ['2.0.0', '=1.0.0', false],
    ['0.9.9', '=1.0.0', false],
    ['0.0.0', '=1.0.0', false],

    // --- Operator "^"
    ['1.0.0', '^1.0.0', true],
    ['1.0.1', '^1.0.0', true],
    ['1.1.0', '^1.0.0', true],
    ['2.0.0', '^1.0.0', false],
    ['0.9.9', '^1.0.0', false],
    ['0.0.0', '^1.0.0', false],

    // --- Operator "~"
    ['1.0.0', '~1.0.0', true],
    ['1.0.1', '~1.0.0', true],
    ['1.1.0', '~1.0.0', false],
    ['2.0.0', '~1.0.0', false],
    ['0.9.9', '~1.0.0', false],
    ['0.0.0', '~1.0.0', false],

  ])('should check if %s is %s and return %s', (version, range, expected) => {
    const result = createSemver(version).satisfies(range)
    expect(result).toEqual(expected)
  })
}
