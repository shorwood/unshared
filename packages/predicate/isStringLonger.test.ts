import { expect, it } from 'vitest'
import { isStringLonger } from './isStringLonger'

it.each([

  // --- Returns true
  [true, 'foobar', 3],

  // --- Returns false
  [false, 'foobar', 6],
  [false, 'foobar', 9],
  [false, [1, 2, 3, 4], 3],

])('should return %s when checking if "%s" is a string longer than %s', (expected, value: any, length: number) => {
  const result = isStringLonger(value, length)
  expect(result).toEqual(expected)
})
