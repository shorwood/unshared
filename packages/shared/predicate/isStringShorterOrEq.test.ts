import { expect, it } from 'vitest'
import { isStringShorterOrEq } from './isStringShorterOrEq'

it.each([

  // --- Returns true
  [true, 'foobar', 6],
  [true, 'foobar', 9],

  // --- Returns false
  [false, 'foobar', 3],
  [false, [], 3],

])('should return %s when checking if "%s" is a string shorter or equal to %s', (expected, value: any, length: number) => {
  const result = isStringShorterOrEq(value, length)
  expect(result).toEqual(expected)
})
