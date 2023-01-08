import { expect, it } from 'vitest'
import { isObjectEqual } from './isObjectEqual'

it.each([

  // --- Returns true
  [true, {}, {}, undefined],
  [true, { a: 1 }, { a: 1 }, undefined],
  [true, { a: 1 }, { a: 1, b: undefined }, undefined],
  [true, { a: 1, b: 2 }, { a: 1, b: 2 }, undefined],

  // --- Nested objects
  [true, { a: [1, 2, 3] }, { a: [1, 2, 3] }, true],
  [true, { a: [1, 2, 3] }, { a: [1, 2, 3] }, 1],
  [false, { a: [1, 2, 3] }, { a: [1, 2, 3] }, false],
  [false, { a: [1, 2, 3] }, { a: [1, 2, 3] }, 0],

  // --- Returns false
  [false, {}, { a: 1 }, undefined],
  [false, { a: 1, b: 1 }, { a: 1, b: 2 }, undefined],
  [false, { a: [1, 2, 3] }, { a: [1, 2] }, undefined],

  // --- Invalid values
  [false, 'foobar', 'foobar', undefined],

])('should return %s when checking if %s is equal to %s', (expected, value: any, other: any, depth: any) => {
  const result = isObjectEqual(value, other, depth)
  expect(result).toEqual(expected)
})
