import { expect, it } from 'vitest'
import { isArrayIncludingSome } from './isArrayIncludingSome'

it.each([

  // --- Returns true
  [true, [1, 2, 3], [1]],
  [true, [1, 2, 3], [1, 2, 3]],
  [true, [1, 2, 3], [1, 2, 4]],

  // --- Returns false
  [false, [1, 2, 3], 1],
  [false, [1, 2, 3], []],
  [false, [1, 2, 3], [4]],
  [false, [1, 2, 3], ['1']],

])('should return %s when checking if %s is an array including %s', (expected, value, array: any) => {
  const result = isArrayIncludingSome(value, array)
  expect(result).toEqual(expected)
})
