import { expect, it } from 'vitest'
import { isArrayNotIncluding } from './isArrayNotIncluding'

it.each([

  // --- Returns true
  [true, [1, 2, 3], 4],
  [true, [1, 2, 3], '1'],
  [true, [1, 2, 3], [1, 2, 3]],
  [true, [1, 2, 3], undefined],
  [true, [[]], []],

  // --- Returns false
  [false, [1, 2, 3], 1],
  [false, [1, 2, 3], 2],
  [false, [1, 2, 3], 3],

])('should return %s when checking if %s is an array not including %s', (expected, value, item) => {
  const result = isArrayNotIncluding(value, item)
  expect(result).toEqual(expected)
})
