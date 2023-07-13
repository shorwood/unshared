import { Semver } from './createSemver'
import { SemverComponent, semverBump } from './semverBump'
import { semverParse } from './semverParse'
import { semverStringify } from './semverStringify'

/**
 * A class that represents a Sementic Version. This class is meant to be used
 * as a type-safe alternative to the native `string` type for representing
 * versions.
 */
export class SementicVersion implements Semver {
  /**
   * Create a new `SementicVersion` instance from the given semver object.
   *
   * @param semver A object that defines the components of a sementic version.
   * @example new SementicVersion({ major: 1 }) // '1.0.0'
   */
  constructor(semver: Partial<Semver>) {
    Object.assign(this, semver)
  }

  // --- Default values for the semver components.
  major = 0
  minor = 0
  patch = 0
  prerelease?: string = undefined
  build?: string = undefined

  /**
   * Parse a string into a SementicVersion instance.
   *
   * @param version The version string to parse.
   * @returns A SementicVersion instance.
   * @example SementicVersion.parse('1.2.3-alpha+build')
   */
  static parse(version: string): SementicVersion {
    return new SementicVersion(semverParse(version))
  }

  /**
   * Bump the given component of the Sementic Version.
   *
   * @param component The component to bump.
   * @returns A new SementicVersion instance.
   * @example new SementicVersion({ major: 1 }).bump('major') // '2.0.0'
   */
  public bump(component: SemverComponent): SementicVersion {
    return new SementicVersion(semverBump(this, component))
  }

  /**
   * Return a string representation of the Sementic Version.
   *
   * @returns A string representation of the Sementic Version.
   * @example new SementicVersion({ major: 1 }).toString() // '1.0.0'
   */
  public stringify(): string {
    return semverStringify(this)
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should parse a string into a SementicVersion instance', () => {
    const version = '1.2.3-alpha+build'
    const result = SementicVersion.parse(version)
    expect(result).toEqual({ major: 1, minor: 2, patch: 3, prerelease: 'alpha', build: 'build' })
  })

  it('should bump the given component of the Sementic Version', () => {
    const version = new SementicVersion({ major: 1 })
    const result = version.bump('major')
    expect(result).toEqual({ major: 2, minor: 0, patch: 0, prerelease: undefined, build: undefined })
  })

  it('should return a string representation of the Sementic Version', () => {
    const version = new SementicVersion({ major: 1 })
    const result = version.toString()
    expect(result).toEqual('1.0.0')
  })
}
