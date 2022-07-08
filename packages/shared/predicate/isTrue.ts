export interface IsTrue {
  (value: boolean): value is true
  (value: Boolean): value is { valueOf(): true } & Boolean
}

/**
 * Check if value is `true` or a `Boolean` with a value of `true`
 * @param {boolean | Boolean} value The value to check
 * @returns {boolean} `true` if value is `true`, `false` otherwise
 * @example
 * isTrue(true) // true
 * isTrue(new Boolean(true)) // true
 */
export const isTrue: IsTrue = (value: boolean | Boolean): value is any =>
  value === true
  || (value instanceof Boolean && value.valueOf() === true)
