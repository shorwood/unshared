export interface IsFalse {
  (value: boolean): value is false
  (value: Boolean): value is { valueOf(): false } & Boolean
}

/**
 * Check if value is `false` or a `Boolean` with a value of `false`
 * @param {boolean | Boolean} value The value to check
 * @returns {boolean} `true` if value is `false`, `false` otherwise
 * @example
 * isFalse(false) // true
 * isFalse(new Boolean(false)) // true
 */
export const isFalse: IsFalse = (value: boolean | Boolean): value is any =>
  value === false
  || (value instanceof Boolean && value.valueOf() === false)
