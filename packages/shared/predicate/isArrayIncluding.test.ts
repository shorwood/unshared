import { expect, it } from 'vitest'
import { isArrayIncluding } from './isArrayIncluding'

it.each([

  // --- Returns true
  [true, [1, 2, 3], 1],
  [true, [1, 2, 3], 2],
  [true, [1, 2, 3], 3],

  // --- Returns false
  [false, [1, 2, 3], 4],
  [false, [1, 2, 3], '1'],
  [false, [1, 2, 3], [1, 2, 3]],
  [false, [1, 2, 3], undefined],
  [false, [[]], []],

])('should return %s when checking if %s is an array including %s', (expected, value, item) => {
  const result = isArrayIncluding(value, item)
  expect(result).toEqual(expected)
})
