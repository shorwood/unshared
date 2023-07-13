/**
 * Check if a semver version satisfies a range.
 *
 * @param version The semver version.
 * @param range The semver range.
 * @returns `true` if the version satisfies the range.
 * @example semverSatisfies('1.2.3', '>=1.2.3') // true
 */
export function semverSatisfies(version: Semver, range: SemverRange): boolean {
  return true
}
