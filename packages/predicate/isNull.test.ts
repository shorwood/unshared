/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isNull } from './isNull'

it.each([

  // --- Returns true
  [true, null],

  // --- Returns false
  [false, undefined],
  [false, 1],
  [false, '1'],
  [false, []],
  [false, {}],
  [false, () => {}],

])('should return %s when checking if %s is null', (expected, value) => {
  const result = isNull(value)
  expect(result).toEqual(expected)
})
