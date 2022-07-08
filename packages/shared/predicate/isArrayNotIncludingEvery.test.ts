import { expect, it } from 'vitest'
import { isArrayNotIncludingEvery } from './isArrayNotIncludingEvery'

it.each([

  // --- Returns true
  [true, [1, 2, 3], [4, 5, 6]],
  [true, [1, 2, 3], [4, 5]],
  [true, [1, 2, 3], [4]],
  [true, [1, 2, 3], []],

  // --- Returns false
  [false, [1, 2, 3], [1, 2, 4]],
  [false, [1, 2, 3], [1, 2]],
  [false, [1, 2, 3], [1]],
  [false, [1, 2, 3], [2, 3]],
  [false, [1, 2, 3], [2]],
  [false, [1, 2, 3], [3]],
  [false, [1, 2, 3], 4],

])('should return %s when checking if %s is an items not including every items of %s', (expected, value, items: any) => {
  const result = isArrayNotIncludingEvery(value, items)
  expect(result).toEqual(expected)
})
