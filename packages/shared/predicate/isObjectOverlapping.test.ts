import { expect, it } from 'vitest'
import { isObjectOverlapping } from './isObjectOverlapping'

it.each([

  // --- Returns true
  [true, { a: 1 }, { a: 2 }, undefined],

  // --- Nested objects
  [false, { a: [1, 2, 3] }, { a: [1, 2] }, true],
  [false, { a: [1, 2, 3] }, { a: [1, 2, 3] }, 1],

  // --- Returns false
  [false, {}, {}, undefined],
  [false, { a: 1 }, { a: 1 }, undefined],
  [false, { a: 1 }, { a: 1, b: 2 }, undefined],

  // --- Invalid values
  [false, 1, 1, undefined],
  [false, 1, 2, undefined],
  [false, 'foobar', 'foo', undefined],
  [false, 'foobar', 'foobar', undefined],

])('should return %s when checking if %s is not overlapping with %s', (expected, value: any, other: any, depth: any) => {
  const result = isObjectOverlapping(value, other, depth)
  expect(result).toEqual(expected)
})
