/**
 * Check if string matches IPv6 addresses.
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches regex, `false` otherwise
 * @see https://en.wikipedia.org/wiki/IPv6
 * @example
 * isStringIpv6('::1') // true
 * isStringIpv6('fe80::ae21:afff:feea:8e4a') // true
 * isStringIpv6('127.0.0.1') // false
 */
export const isStringIpv6 = (value: string): boolean =>
  typeof value === 'string'
  && /^(([\da-f]{1,4}:){7}[\da-f]{1,4}|([\da-f]{1,4}:){1,7}:|([\da-f]{1,4}:){1,6}:[\da-f]{1,4}|([\da-f]{1,4}:){1,5}(:[\da-f]{1,4}){1,2}|([\da-f]{1,4}:){1,4}(:[\da-f]{1,4}){1,3}|([\da-f]{1,4}:){1,3}(:[\da-f]{1,4}){1,4}|([\da-f]{1,4}:){1,2}(:[\da-f]{1,4}){1,5}|[\da-f]{1,4}:((:[\da-f]{1,4}){1,6})|:((:[\da-f]{1,4}){1,7}|:)|fe80:(:[\da-f]{0,4}){0,4}%[\da-z]+|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)|([\da-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d))$/i.test(value)
