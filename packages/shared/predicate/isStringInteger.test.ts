import { expect, it } from 'vitest'
import { isStringInteger } from './isStringInteger'

it.each([

  // --- Returns true
  [true, '1'],
  [true, '-1'],

  // --- Returns false
  [false, 1],
  [false, '1.0'],
  [false, '1n'],
  [false, '-1n'],
  [false, '-1.0'],
  [false, 'foobar'],

])('should return %s when checking if %s is a string representing an integer number', (expected, value: any) => {
  const result = isStringInteger(value)
  expect(result).toEqual(expected)
})
