import { expect, it } from 'vitest'
import { isStringIntegerNegative } from './isStringIntegerNegative'

it.each([

  // --- Returns true
  [true, '-1'],

  // --- Returns false
  [false, 1],
  [false, '1'],
  [false, '1.0'],
  [false, '1n'],
  [false, '-1n'],
  [false, '-1.0'],
  [false, 'foobar'],

])('should return %s when checking if %s is a string representing a negative integer number', (expected, value: any) => {
  const result = isStringIntegerNegative(value)
  expect(result).toEqual(expected)
})
