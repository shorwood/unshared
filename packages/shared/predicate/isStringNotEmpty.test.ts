import { expect, it } from 'vitest'
import { isStringNotEmpty } from './isStringNotEmpty'

it.each([

  // --- Returns true
  [true, 'foobar'],
  [true, '  foobar  '],

  // --- Returns false
  [false, ''],
  [false, '  '],
  [false, '\t'],
  [false, '\n'],
  [false, '\r'],
  [false, '\f'],
  [false, '\v'],

])('should return %s when checking if "%s" is a string not empty', (expected, value) => {
  const result = isStringNotEmpty(value)
  expect(result).toEqual(expected)
})
