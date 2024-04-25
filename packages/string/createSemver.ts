import { NumberIntegerPositive } from '@unshared/types'

export const SEMVER_REGEXP = /^(?<major>0|[1-9]\d*)\.(?<minor>0|[1-9]\d*)\.(?<patch>0|[1-9]\d*)(?:-(?<prerelease>(?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][\dA-Za-z-]*))*))?(?:\+(?<buildmetadata>[\dA-Za-z-]+(?:\.[\dA-Za-z-]+)*))?$/

/** The components of a semver version. */
export type SemverComponents = 'build' | 'major' | 'minor' | 'patch' | 'prerelease'

/**
 * A class that represents a Sementic Version. This class is meant to be used as a type-safe
 * alternative to the native `string` type for representing versions. The implementation of
 * this class is based on the [semver.org](https://semver.org/) recommendation.
 */
export class Semver {

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
   * Parse a semver string into a [Semver](https://en.wikipedia.org/wiki/Software_versioning) object.
   *
   * @param version The semver string to parse.
   * @returns An object containing the major, minor, patch, prerelease and build versions.
   * @example Semver.parse('1.2.3-alpha+build') // Semver { ... }
   */
  static parse(version: string): Semver {
    const match = version.match(SEMVER_REGEXP)
    if (!match) throw new Error(`Invalid semver version: ${version}`)
    return new Semver({
      build: match.groups!.buildmetadata,
      major: Number.parseInt(match.groups!.major, 10),
      minor: Number.parseInt(match.groups!.minor, 10),
      patch: Number.parseInt(match.groups!.patch, 10),
      prerelease: match.groups!.prerelease,
    })
  }

  /**
   * Bump one of the components of a semver version. This method returns a new
   * `Semver` instance with the bumped component. Be aware that bumping the
   * `patch`, `minor` or `major` component will reset the smaller components
   * to 0. For example, bumping the `minor` component of `1.2.3-alpha+build`
   * will return a `Semver` instance with the version `1.3.0`.
   *
   * @param component The component to bump.
   * @param value Optionally set the component to the given value.
   * @returns The bumped semver version.
   * @example new Semver({ major: 1 }).bump('minor') // Semver { major: 1, minor: 1, patch: 0 }
   */
  bump(component: 'build' | 'prerelease', value: string): Semver
  bump<N extends number>(component: 'major' | 'minor' | 'patch', value?: NumberIntegerPositive<N>): Semver
  bump<N extends number>(component: SemverComponents, value?: NumberIntegerPositive<N>): Semver
  bump(component: string, value?: number | string): Semver {
    let { build, major, minor, patch, prerelease } = this

    // --- If a value is provided, set the component to the given value.
    if (value !== undefined) return new Semver({ build, [component]: value, major, minor, patch, prerelease })

    // --- Bump the component.
    if (component === 'major') { major += 1; minor = 0; patch = 0; prerelease = undefined; build = undefined }
    if (component === 'minor') { minor += 1; patch = 0; prerelease = undefined; build = undefined }
    if (component === 'patch') { patch += 1; prerelease = undefined; build = undefined }

    // --- If the component is the prerelease or build and no value is provided, throw an error.
    if (component === 'prerelease' || component === 'build')
      throw new Error(`You must provide a value when bumping the ${component} component.`)

    // --- Return the bumped semver.
    return new Semver({ build, major, minor, patch, prerelease })
  }

  /**
   * Check if the given semver version satisfies the current semver range as defined by
   * the [RFC 2119](https://tools.ietf.org/html/rfc2119) specification.
   *
   * @param range The semver range to check.
   * @returns `true` if the given semver version satisfies the current semver range, otherwise `false`.
   * @example new Semver({ major: 1 }).satisfies('>=1.0.0') // true
   */
  satisfies(range: string): boolean {

    // --- Get the comparison operator and the version to compare.
    const rangeMatch = range.match(/^(>=|<=|>|<|=|\^|~)?\s*(.*)$/)
    if (!rangeMatch) throw new Error(`Invalid semver range: ${range}`)

    // --- Get the comparison operator and the version to compare.
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

  /**
   * Return a string representation of the Sementic Version.
   *
   * @returns A string representation of the Sementic Version.
   * @example new Semver({ major: 1 }).stringify() // '1.0.0'
   */
  toString(): string {
    const { build, major, minor, patch, prerelease } = this
    const version = `${major}.${minor}.${patch}`
    const prereleaseString = prerelease ? `-${prerelease}` : ''
    const buildString = build ? `+${build}` : ''
    return `${version}${prereleaseString}${buildString}`
  }
}

/**
 * Create a semver instance from the given semver components or semver string. The implementation of
 * this function is based on the [semver.org](https://semver.org/) recommendation.
 *
 * @param semver A semver string or object that defines the components of a sementic version.
 * @returns A semver instance.
 * @example
 *
 * // Create a semver instance from the given string.
 * const version = createSemver('1.2.3-alpha4+build5')
 *
 * // Bump the major component.
 * version.bump('major') // Semver { major: 2, minor: 0, patch: 0 }
 *
 * // Check if the version satisfies the given range.
 * version.satisfies('>=2.0.0') // true
 */
export function createSemver(semver?: Partial<Semver> | string): Semver {
  return typeof semver === 'string' ? Semver.parse(semver) : new Semver(semver)
}

/* v8 ignore next */
if (import.meta.vitest) {
  const semverString = '1.2.3-alpha4+build5'
  const semverObject = { build: 'build5', major: 1, minor: 2, patch: 3, prerelease: 'alpha4' }

  test('should create a Semver instance with default values', () => {
    const version = createSemver()
    const expected = new Semver({ build: undefined, major: 0, minor: 0, patch: 0, prerelease: undefined })
    expect(version).toStrictEqual(expected)
  })

  test('should create a Semver instance from the given object', () => {
    const version = createSemver(semverObject)
    expect(version).toMatchObject(semverObject)
  })

  test('should create a Semver instance from parsing the given string', () => {
    const version = createSemver(semverString)
    expect(version).toMatchObject(semverObject)
  })

  test('should throw an error when parsing an invalid semver string', () => {
    const shouldThrow = () => createSemver('invalid')
    expect(shouldThrow).toThrow('Invalid semver version: invalid')
  })

  test('should bump the major component', () => {
    const version = createSemver(semverString).bump('major')
    expect(version).toMatchObject({ build: undefined, major: 2, minor: 0, patch: 0, prerelease: undefined })
  })

  test('should bump the minor component', () => {
    const version = createSemver(semverString).bump('minor')
    expect(version).toMatchObject({ build: undefined, major: 1, minor: 3, patch: 0, prerelease: undefined })
  })

  test('should bump the patch component', () => {
    const version = createSemver(semverString).bump('patch')
    expect(version).toMatchObject({ build: undefined, major: 1, minor: 2, patch: 4, prerelease: undefined })
  })

  test('should set a component to the given value', () => {
    const version = createSemver(semverString).bump('prerelease', 'beta')
    expect(version).toMatchObject({ build: 'build5', major: 1, minor: 2, patch: 3, prerelease: 'alpha4' })
  })

  test('should stringify the semver', () => {
    const version = createSemver(semverString).toString()
    expect(version).toStrictEqual(semverString)
  })

  test.each([

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

  ])('should check if %s satisfies %s and return %s', (version: string, range: string, expected: boolean) => {
    const result = createSemver(version).satisfies(range)
    expect(result).toStrictEqual(expected)
  })
}
