import { expect, it } from 'vitest'
import { isStringMatching } from './isStringMatching'

it.each([

  // --- Returns true
  [true, 'foobar', 'foo'],
  [true, 'foobar', /foo/],
  [true, 'foobar', ''],

  // --- Returns false
  [true, 'foobar', 'bar'],
  [true, 'foobar', /bar/],
  [false, '', 'foo'],
  [false, 1, 'bar'],
  [false, 'foo', 1],
  [false, 1, 1],

])('should return %s when checking if %s is a string matching %s', (expected, value: any, matching: any) => {
  const result = isStringMatching(value, matching)
  expect(result).toEqual(expected)
})
