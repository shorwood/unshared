import { expect, it } from 'vitest'
import { isNumberGreaterOrEq } from './isNumberGreaterOrEq'

it.each([

  // --- Returns true
  [true, 1, 0],
  [true, 1, 1],
  [true, 1, Number.MIN_SAFE_INTEGER],

  // --- Returns false
  [false, 1, 2],
  [false, 1, Number.NaN],
  [false, 1, Number.MAX_SAFE_INTEGER],

])('should return %s when checking if %s is greater or equal to %s', (expected, value, other) => {
  const result = isNumberGreaterOrEq(value, other)
  expect(result).toEqual(expected)
})
