/**
 * Check if string matches IPv4.
 *
 * @param value The value to check
 * @returns `true` if string matches an IPv4 address, `false` otherwise
 * @see https://en.wikipedia.org/wiki/IPv4
 * @example
 * isStringIpv4('192.168.0.1')  // true
 * isStringIpv4('192.168.0.256')  // false
 */
export function isStringIpv4(value: string): boolean {
  return typeof value === 'string'
    && /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})$/.test(value)
}
