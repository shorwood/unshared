import { expect, it } from 'vitest'
import { isNumberOdd } from './isNumberOdd'

it.each([

  // --- Returns true
  [true, 1],
  [true, 3],
  [true, Number.MAX_SAFE_INTEGER],

  // --- Returns false
  [false, 2],
  [false, 2.5],
  [false, Number.MAX_SAFE_INTEGER - 1],

])('should return %s when checking if %s is odd', (expected, value) => {
  const result = isNumberOdd(value)
  expect(result).toEqual(expected)
})
