/**
 * Check if string matches IPv4.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches an IPv4 address, `false` otherwise
 * @see https://en.wikipedia.org/wiki/IPv4
 * @example
 * isStringIpv4('192.168.0.1')  // true
 * isStringIpv4('192.168.0.256')  // false
 */
export const isStringIpv4 = (value: string): boolean =>
  typeof value === 'string'
  && /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})$/.test(value)
