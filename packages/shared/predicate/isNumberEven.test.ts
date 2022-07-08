import { expect, it } from 'vitest'
import { isNumberEven } from './isNumberEven'

it.each([

  // --- Returns true
  [true, 0],
  [true, 2],
  [true, Number.MAX_SAFE_INTEGER - 1],

  // --- Returns false
  [false, 1],
  [false, 2.5],
  [false, Number.MAX_SAFE_INTEGER],

])('should return %s when checking if %s is even', (expected, value) => {
  const result = isNumberEven(value)
  expect(result).toEqual(expected)
})
