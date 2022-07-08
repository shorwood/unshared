import { expect, it } from 'vitest'
import { isStringJwt } from './isStringJwt'

it.each([

  // --- Returns true
  [true, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'],

  // --- Returns false
  [false, 'foobar'],
  [false, 0],

])('should return %s when checking if %s is a string representing a JWT', (expected, value: any) => {
  const result = isStringJwt(value)
  expect(result).toEqual(expected)
})
