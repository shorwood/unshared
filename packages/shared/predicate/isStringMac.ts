/**
 * Check if string matches a MAC address.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches a MAC address, `false` otherwise
 * @example
 * isStringMac('AB:CD:EF') // false
 * isStringMac('01:AB:CD:EF:AB:CD') // true
 */
export const isStringMac = (value: string): boolean =>
  typeof value === 'string'
  && /^[\da-f]{2}(:[\da-f]{2}){5}$/i.test(value)
