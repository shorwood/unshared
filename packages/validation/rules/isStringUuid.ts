/**
 * Check if string matches UUID.
 *
 * @param value The value to check
 * @returns `true` if string matches an UUID, `false` otherwise
 * @see https://www.ietf.org/rfc/rfc4122.txt
 * @example
 * isStringUuid('12345678-1234-1234-1234-123456789012') // true
 */
export function isStringUuid(value: unknown): value is string {
  return typeof value === 'string'
  && /^(?:[\da-f]{8}-[\da-f]{4}-[1-5][\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}|0{8}-(?:0{4}-){3}0{12})$/i.test(value)
}
