import { expect, it } from 'vitest'
import { isStringLongerOrEq } from './isStringLongerOrEq'

it.each([

  // --- Returns true
  [true, 'foobar', 3],
  [true, 'foobar', 6],

  // --- Returns false
  [false, 'foobar', 9],
  [false, [1, 2, 3, 4], 3],

])('should return %s when checking if "%s" is a string longer or equal to %s', (expected, value: any, length: number) => {
  const result = isStringLongerOrEq(value, length)
  expect(result).toEqual(expected)
})
