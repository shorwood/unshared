/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isArrayEmpty } from './isArrayEmpty'

it.each([

  // --- Returns true
  [true, []],

  // --- Returns false
  [false, [1, 2, 3]],
  [false, {}],

])('should return %s when checking if %s is an empty array', (expected, value: any) => {
  const result = isArrayEmpty(value)
  expect(result).toEqual(expected)
})
