/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isNumber } from './isNumber'

it.each([

  // --- Returns true
  [true, 1],
  [true, 1.1],
  [true, 1e10],

  // --- Returns false
  [false, Number.POSITIVE_INFINITY],
  [false, Number.NEGATIVE_INFINITY],
  [false, Number.NaN],
  [false, Number],
  [false, '1'],
  [false, undefined],
  [false, null],
  [false, []],
  [false, {}],
  [false, () => {}],

])('should return %s when checking if %s is a number', (expected, value) => {
  const result = isNumber(value)
  expect(result).toEqual(expected)
})
