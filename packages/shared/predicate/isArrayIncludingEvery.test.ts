import { expect, it } from 'vitest'
import { isArrayIncludingEvery } from './isArrayIncludingEvery'

it.each([

  // --- Returns true
  [true, [1, 2, 3], [1, 2, 3]],
  [true, [1, 2, 3], [1, 2]],
  [true, [1, 2, 3], [1]],
  [true, [1, 2, 3], []],

  // --- Returns false
  [false, [1, 2, 3], [1, 2, 4]],
  [false, [1, 2, 3], 4],
  [false, [1, 2, 3], '123'],

])('should return %s when checking if %s is an items including every %s', (expected, value, items: any) => {
  const result = isArrayIncludingEvery(value, items)
  expect(result).toEqual(expected)
})
