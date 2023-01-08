import { expect, it } from 'vitest'
import { isNumberInteger } from './isNumberInteger'

it.each([

  // --- Returns true
  [true, 1],
  [true, Number.MAX_SAFE_INTEGER],

  // --- Returns false
  [false, 1.5],
  [false, Number.NaN],

])('should return %s when checking if %s is an integer', (expected, value) => {
  const result = isNumberInteger(value)
  expect(result).toEqual(expected)
})
