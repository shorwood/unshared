/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isArrayNotEmpty } from './isArrayNotEmpty'

it.each([

  // --- Returns true
  [true, [1, 2, 3]],

  // --- Returns false
  [false, []],
  [false, ''],
  [false, {}],
  [false, { a: 1 }],

])('should return %s when checking if %s is not an empty array', (expected, value: any) => {
  const result = isArrayNotEmpty(value)
  expect(result).toEqual(expected)
})
