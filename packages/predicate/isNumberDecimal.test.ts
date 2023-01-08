import { expect, it } from 'vitest'
import { isNumberDecimal } from './isNumberDecimal'

it.each([

  // --- Returns true
  [true, 1.5],
  [true, -1.5],
  [true, 1.005e2],
  [true, -1.005e2],

  // --- Returns false
  [false, 1],
  [false, -1],
  [false, '1'],
  [false, []],
  [false, {}],
  [false, () => {}],
  [false, Number.POSITIVE_INFINITY],
  [false, Number.NEGATIVE_INFINITY],
  [false, Number.NaN],
  [false, Number],

])('should return %s when checking if %s is a decimal number', (expected, value: any) => {
  const result = isNumberDecimal(value)
  expect(result).toEqual(expected)
})
