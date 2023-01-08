import { expect, it } from 'vitest'
import { isNumberGreater } from './isNumberGreater'

it.each([

  // --- Returns true
  [true, 1, 0],
  [true, 1, Number.MIN_SAFE_INTEGER],

  // --- Returns false
  [false, 1, 1],
  [false, 1, 2],
  [false, 1, Number.NaN],
  [false, 1, Number.MAX_SAFE_INTEGER],

])('should return %s when checking if %s is greater than %s', (expected, value, other) => {
  const result = isNumberGreater(value, other)
  expect(result).toEqual(expected)
})
