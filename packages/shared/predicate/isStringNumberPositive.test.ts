import { expect, it } from 'vitest'
import { isStringNumberPositive } from './isStringNumberPositive'

it.each([

  // --- Returns true
  [true, '1'],
  [true, '0.1'],
  [true, '0'],
  [true, '0.0'],

  // --- Returns false
  [false, ''],
  [false, '-0'],
  [false, '-0.0'],
  [false, '-0.1'],
  [false, '-1'],
  [false, '-1.0'],
  [false, '-1a'],
  [false, '-a'],
  [false, '1a'],
  [false, 'a'],

])('should return %s when checking if %s is a string number negative', (expected, value) => {
  const result = isStringNumberPositive(value)
  expect(result).toEqual(expected)
})
