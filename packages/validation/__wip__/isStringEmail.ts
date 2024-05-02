export const EXP_EMAIL = /^[\w!#$%&'*+./=?^`{|}~-]+@[\da-z](?:[\da-z-]{0,61}[\da-z])?(?:\.[\da-z](?:[\da-z-]{0,61}[\da-z])?)*$/i

/**
 * Check if string matches an [email address](https://en.wikipedia.org/wiki/Email_address)
 * as defined by the [RFC 5322](https://tools.ietf.org/html/rfc5322#section-3.4.1)
 *
 * @param value The value to check.
 * @returns `true` if string is an email, `false` otherwise.
 * @example isStringEmail('john.doe@gmail.com') // true
 */
export function isStringEmail(value: unknown): boolean {
  return typeof value === 'string' && EXP_EMAIL.test(value)
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return true when checking if "acme@example.com" is an email', () => {
    const result = isStringEmail('acme@example.com')
    expect(result).toBeTruthy()
  })

  test('should return true when checking if "not-an-email" is an email', () => {
    const result = isStringEmail('not-an-email')
    expect(result).toBeFalsy()
  })

  test('should return false when checking if 123 is an email', () => {
    const result = isStringEmail(123)
    expect(result).toBeFalsy()
  })

  test('should return false when checking if undefined is an email', () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    const result = isStringEmail(undefined)
    expect(result).toBeFalsy()
  })
}
