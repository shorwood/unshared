/**
 * Check if string matches port numbers.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches a port number, `false` otherwise
 * @see https://en.wikipedia.org/wiki/Port_(computer_networking)
 * @example
 * isStringPort('443') // true
 * isStringPort('8080') // true
 * isStringPort('3000/tcp') // false
 */
export const isStringPort = (value: string): boolean =>
  typeof value === 'string'
  && /^((6553[0-5])|(655[0-2]\d)|(65[0-4]\d{2})|(6[0-4]\d{3})|([1-5]\d{4})|([0-5]{0,5})|(\d{1,4}))$/.test(value)
