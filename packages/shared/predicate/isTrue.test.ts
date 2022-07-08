/* eslint-disable unicorn/no-null */
/* eslint-disable no-new-wrappers */
/* eslint-disable unicorn/new-for-builtins */
import { expect, it } from 'vitest'
import { isTrue } from './isTrue'

it.each([

  // --- Returns true
  [true, true],
  [true, new Boolean(true)],

  // --- Returns false
  [false, false],
  [false, new Boolean(false)],
  [false, null],
  [false, undefined],
  [false, 1],
  [false, '1'],
  [false, []],
  [false, {}],
  [false, () => {}],

])('should return %s when checking if %s is true', (expected, value: any) => {
  const result = isTrue(value)
  expect(result).toEqual(expected)
})
