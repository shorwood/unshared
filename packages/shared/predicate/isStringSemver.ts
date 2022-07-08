/**
 * Check if string matches Semantic Versioning version.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches a Semantic Versioning version, `false` otherwise
 * @see https://semver.org/
 * @example
 * isStringSemver('1.0.0-rc.3') // true
 * isStringSemver('1.0.a') // false
 * isStringSemver('1.0') // false
 */
export const isStringSemver = (value: string): boolean =>
  typeof value === 'string'
  && /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-z-][\da-z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-z-][\da-z-]*))*))?(?:\+([\da-z-]+(?:\.[\da-z-]+)*))?$/i.test(value)
