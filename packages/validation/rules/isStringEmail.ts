/**
 * Check if string matches an email.
 *
 * @param value The value to check
 * @returns `true` if string is an email, `false` otherwise
 * @see https://en.wikipedia.org/wiki/Email_address
 * @example
 * isStringEmail('john.doe@') // false
 * isStringEmail('john.doe@gmail.com') // true
 */
export function isStringEmail(value: string): boolean {
  return typeof value === 'string'
  && /^[\w!#$%&'*+./=?^`{|}~-]+@[\da-z](?:[\da-z-]{0,61}[\da-z])?(?:\.[\da-z](?:[\da-z-]{0,61}[\da-z])?)*$/i.test(value)
}
