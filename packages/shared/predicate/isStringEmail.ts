/**
 * Check if string matches an email.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string is an email, `false` otherwise
 * @see https://en.wikipedia.org/wiki/Email_address
 * @example
 * isStringEmail('john.doe@') // false
 * isStringEmail('john.doe@gmail.com') // true
 */
export const isStringEmail = (value: string): boolean =>
  typeof value === 'string'
  && /^[\w!#$%&'*+./=?^`{|}~-]+@[\da-z](?:[\da-z-]{0,61}[\da-z])?(?:\.[\da-z](?:[\da-z-]{0,61}[\da-z])?)*$/i.test(value)
