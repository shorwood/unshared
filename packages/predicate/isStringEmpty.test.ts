import { expect, it } from 'vitest'
import { isStringEmpty } from './isStringEmpty'

it.each([

  // --- Returns true
  [true, ''],
  [true, ' '],
  [true, '\t'],
  [true, '\n'],
  [true, '\r'],
  [true, '\f'],
  [true, '\v'],

  // --- Returns false
  [false, []],
  [false, 'foobar'],
  [false, '  foobar  '],

])('should return %s when checking if "%s" is a string empty', (expected, value: any) => {
  const result = isStringEmpty(value)
  expect(result).toEqual(expected)
})
