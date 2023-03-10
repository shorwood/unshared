import { isNumberLowerOrEq } from './isNumberLowerOrEq'

it.each([

  // --- Returns true
  [true, 1, 2],
  [true, 1, 1],
  [true, 1, Number.MAX_SAFE_INTEGER],

  // --- Returns false
  [false, 1, 0],
  [false, 1, Number.NaN],
  [false, 1, Number.MIN_SAFE_INTEGER],

])('should return %s when checking if %s is lower or equal to %s', (expected, value, other) => {
  const result = isNumberLowerOrEq(value, other)
  expect(result).toEqual(expected)
})
