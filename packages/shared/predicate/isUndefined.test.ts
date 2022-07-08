/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isUndefined } from './isUndefined'

it.each([

  // --- Returns true
  [true, undefined],

  // --- Returns false
  [false, null],
  [false, 1],
  [false, '1'],
  [false, []],
  [false, {}],
  [false, () => {}],
  [false, false],

])('should return %s when checking if %s is undefined', (expected, value) => {
  const result = isUndefined(value)
  expect(result).toEqual(expected)
})
