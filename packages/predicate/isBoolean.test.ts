/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable no-new-wrappers */
/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isBoolean } from './isBoolean'

it.each([

  // --- Returns true
  [true, true],
  [true, false],
  [true, new Boolean(true)],
  [true, new Boolean(false)],

  // --- Returns false
  [false, null],
  [false, undefined],
  [false, 1],
  [false, '1'],
  [false, []],
  [false, {}],
  [false, () => {}],

])('should return %s when checking if %s is boolean', (expected, value) => {
  const result = isBoolean(value)
  expect(result).toEqual(expected)
})
