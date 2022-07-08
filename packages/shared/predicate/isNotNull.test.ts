/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isNotNull } from './isNotNull'

it.each([

  // --- Returns true
  [true, 0],
  [true, ''],
  [true, []],
  [true, {}],
  [true, () => {}],
  [true, false],
  [true, undefined],

  // --- Returns false
  [false, null],

])('should return %s when checking if %s is not null', (expected, value) => {
  const result = isNotNull(value)
  expect(result).toEqual(expected)
})
