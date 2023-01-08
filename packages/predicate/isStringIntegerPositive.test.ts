import { expect, it } from 'vitest'
import { isStringIntegerPositive } from './isStringIntegerPositive'

it.each([

  // --- Returns true
  [true, '1'],

  // --- Returns false
  [false, 1],
  [false, '-1'],
  [false, '1.0'],
  [false, '1n'],
  [false, '-1n'],
  [false, '-1.0'],
  [false, 'foobar'],
  [false, 0],

])('should return %s when checking if %s is a string representing a positive integer number', (expected, value: any) => {
  const result = isStringIntegerPositive(value)
  expect(result).toEqual(expected)
})
