import { expect, it } from 'vitest'
import { isNumberPositive } from './isNumberPositive'

it.each([

  // --- Returns true
  [true, 1],
  [true, 1.5],
  [true, Number.POSITIVE_INFINITY],

  // --- Returns false
  [false, -1],
  [false, -1.5],
  [false, '1'],
  [false, []],
  [false, {}],
  [false, () => {}],
  [false, Number.NEGATIVE_INFINITY],
  [false, Number.NaN],
  [false, Number],

])('should return %s when checking if %s is a positive number', (expected, value: any) => {
  const result = isNumberPositive(value)
  expect(result).toEqual(expected)
})
