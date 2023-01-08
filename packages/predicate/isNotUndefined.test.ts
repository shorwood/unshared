/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isNotUndefined } from './isNotUndefined'

it.each([

  // --- Returns true
  [true, null],
  [true, 0],
  [true, ''],
  [true, []],
  [true, {}],
  [true, () => {}],
  [true, false],

  // --- Returns false
  [false, undefined],

])('should return %s when checking if %s is not undefined', (expected, value) => {
  const result = isNotUndefined(value)
  expect(result).toEqual(expected)
})
