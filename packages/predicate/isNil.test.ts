/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isNil } from './isNil'

it.each([

  // --- Returns true
  [true, null],
  [true, undefined],

  // --- Returns false
  [false, 0],
  [false, ''],
  [false, []],
  [false, {}],
  [false, () => {}],
  [false, false],

])('should return %s when checking if %s is nil', (expected, value) => {
  const result = isNil(value)
  expect(result).toEqual(expected)
})
