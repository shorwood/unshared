/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isNotNil } from './isNotNil'

it.each([

  // --- Returns true
  [true, 0],
  [true, ''],
  [true, []],
  [true, {}],
  [true, () => {}],
  [true, false],

  // --- Returns false
  [false, null],
  [false, undefined],

])('should return %s when checking if %s is not nil', (expected, value) => {
  const result = isNotNil(value)
  expect(result).toEqual(expected)
})
