import { expect, it } from 'vitest'
import { isObjectNotOverlapping } from './isObjectNotOverlapping'

it.each([

  // --- Returns true
  [true, {}, {}, undefined],
  [true, { a: 1 }, { a: 1 }, undefined],
  [true, { a: 1 }, { a: 1, b: 2 }, undefined],

  // --- Nested objects
  [true, { a: [1, 2, 3] }, { a: [1, 2] }, true],
  [true, { a: [1, 2, 3] }, { a: [1, 2, 3] }, 1],

  // --- Returns false
  [false, { a: 1 }, { a: 2 }, undefined],
  [false, { a: [1, 2, 3] }, { a: [2, 2, 3] }, 1],

  // --- Invalid values
  [false, 1, 1, undefined],
  [false, 1, 2, undefined],
  [false, 'foobar', 'foo', undefined],
  [false, 'foobar', 'foobar', undefined],

])('should return %s when checking if %s is not overlapping with %s', (expected, value: any, other: any, depth: any) => {
  const result = isObjectNotOverlapping(value, other, depth)
  expect(result).toEqual(expected)
})
