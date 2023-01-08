import { expect, it } from 'vitest'
import { isStringNumber } from './isStringNumber'

it.each([

  // --- Returns true
  [true, '1'],
  [true, '-1'],
  [true, '1.0'],
  [true, '-1.0'],

  // --- Returns false
  [false, 1],
  [false, '1.0.0'],
  [false, '1.'],
  [false, '1n'],
  [false, '-1n'],
  [false, '-1.0.0'],
  [false, 'foobar'],

])('should return %s when checking if %s is a string representing a number', (expected, value: any) => {
  const result = isStringNumber(value)
  expect(result).toEqual(expected)
})
