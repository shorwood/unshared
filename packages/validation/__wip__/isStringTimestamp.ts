export const EXP_TIMESTAMP = /^(?![+-]?\d{4,5}-?(\d{2}|w\d{2})t)(|(\d{4}|[+-]\d{5})-?(|(0\d|1[0-2])(|-?([0-2]\d|3[01]))|([0-2]\d{2}|3[0-5]\d|36[0-6])|w([0-4]\d|5[0-3])(|-?([1-7])))((?!\d)|t(?=\d)))(|([01]\d|2[0-4])(|:?([0-5]\d)(|:?([0-5]\d)(|\.(\d{3})))(|z|([+-]([01]\d|2[0-4]))(|:?([0-5]\d)))))$/i

/**
 * Check if string matches an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp.
 *
 * @param value The value to check
 * @returns `true` if string matches an ISO 8601 timestamp, `false` otherwise
 * @example isStringTimestamp('2019-01-01T00:00:00.000Z') // true
 */
export function isStringTimestamp(value: string): boolean {
  return typeof value === 'string' && EXP_TIMESTAMP.test(value)
}
