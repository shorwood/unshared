import { expect, it } from 'vitest'
import { isNumberBetween } from './isNumberBetween'

it.each([

  // --- Returns true
  [true, 0, undefined],
  [true, 0, { min: 0 }],
  [true, 0, { max: 10 }],
  [true, 0, { min: 0, max: 10 }],

  // --- Returns false
  [false, 0, { min: 1 }],
  [false, 0, { max: -1 }],
  [false, 0, { min: 1, max: 10 }],
  [false, 0, { min: -10, max: -1 }],
  [false, 0, { min: Number.NaN }],
  [false, 0, { max: Number.NaN }],
  [false, 0, { min: Number.NaN, max: Number.NaN }],

])('should return %s when checking if %s is a number between %o', (expected, value, range: any) => {
  const result = isNumberBetween(value, range)
  expect(result).toEqual(expected)
})
