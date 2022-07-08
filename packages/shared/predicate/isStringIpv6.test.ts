import { expect, it } from 'vitest'
import { isStringIpv6 } from './isStringIpv6'

it.each([

  // --- Returns true
  [true, '::'],
  [true, '::1'],
  [true, '1::'],
  [true, 'fe80::ae21:afff:feea:8e4a'],
  [true, '2001:0db8:85a3:0000:0000:8a2e:0370:7334'],

  // --- Returns false
  [false, ''],
  [false, '0.0.0.0'],
  [false, '255.255.255.255'],
  [false, 'foo'],
  [false, 0],

])('should return %s when checking if %s is a string IPv6 address', (expected, value: any) => {
  const result = isStringIpv6(value)
  expect(result).toEqual(expected)
})
