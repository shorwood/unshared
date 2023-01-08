import { expect, it } from 'vitest'
import { isStringEndingWith } from './isStringEndingWith'

it.each([
  // --- Returns true
  [true, '', ''],
  [true, 'r', 'r'],
  [true, 'bar', 'bar'],
  [true, 'foobar', 'bar'],

  // --- Returns false
  [false, '', 'foo'],
  [false, 'foo', 'bar'],
  [false, 0, 'bar'],

])('should return %s when checking if %s is a string ending with %s', (expected, value: any, ending) => {
  const result = isStringEndingWith(value, ending)
  expect(result).toEqual(expected)
})
