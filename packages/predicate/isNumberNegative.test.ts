import { expect, it } from 'vitest'
import { isNumberNegative } from './isNumberNegative'

it.each([

  // --- Returns true
  [true, -1],
  [true, -1.5],
  [true, Number.NEGATIVE_INFINITY],

  // --- Returns false
  [false, 1],
  [false, 1.5],
  [false, '1'],
  [false, []],
  [false, {}],
  [false, () => {}],
  [false, Number.POSITIVE_INFINITY],
  [false, Number.NaN],
  [false, Number],

])('should return %s when checking if %s is a nagative number', (expected, value: any) => {
  const result = isNumberNegative(value)
  expect(result).toEqual(expected)
})
