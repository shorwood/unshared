/* eslint-disable no-new-wrappers */
/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isFalse } from './isFalse'

it.each([

  // --- Returns true
  [true, false],
  [true, new Boolean(false)],

  // --- Returns false
  [false, true],
  [false, null],
  [false, undefined],
  [false, 1],
  [false, '1'],
  [false, []],
  [false, {}],
  [false, () => {}],

])('should return %s when checking if %s is false', (expected, value: any) => {
  const result = isFalse(value)
  expect(result).toEqual(expected)
})
