import { expect, it } from 'vitest'
import { isStringIpv4 } from './isStringIpv4'

it.each([

  // --- Returns true
  [true, '1.1.1.1'],
  [true, '255.255.255.255'],
  [true, '192.168.0.1'],
  [true, '0.0.0.0'],

  // --- Returns false
  [false, '1234.1.1.1'],
  [false, '999.255.255.255'],
  [false, '255.255.255.256'],
  [false, '255.255.255'],
  [false, '255.255'],
  [false, '255'],
  [false, '0.0.0.0.0'],
  [false, '1.2.3.4.5'],
  [false, 0],

])('should return %s when checking if %s is a string ipv4', (expected, value: any) => {
  const result = isStringIpv4(value)
  expect(result).toEqual(expected)
})
