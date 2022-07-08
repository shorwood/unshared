/* eslint-disable unicorn/new-for-builtins */
/* eslint-disable no-new-wrappers */
import { expect, it } from 'vitest'
import { toNumber } from './toNumber'

it.each([

  // --- Returns a number
  [42, 42],
  [42, 42n],
  [42, '42.0'],
  [1, true],
  [1, new Boolean(true)],

  // --- Returns 0
  [0, false],
  [0, undefined],
  [0, undefined],
  [0, ''],
  [0, []],
  [0, {}],
  [0, Number.NaN],
])('should return %s when converting %s to a number', (expected, value: any) => {
  const result = toNumber(value)
  expect(result).toEqual(expected)
})
