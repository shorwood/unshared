import { expect, it } from 'vitest'
import { isStringPort } from './isStringPort'

it.each([

  // --- Returns true
  [true, '0'],
  [true, '8080'],
  [true, '80'],
  [true, '443'],
  [true, '65535'],

  // --- Returns false
  [false, '8080/tcp'],
  [false, '65536'],

])('should return %s when checking if %s is a string representing a port', (expected, value: any) => {
  const result = isStringPort(value)
  expect(result).toEqual(expected)
})
