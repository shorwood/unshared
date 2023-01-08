import { expect, it } from 'vitest'
import { isStringStartingWith } from './isStringStartingWith'

it.each([

  // --- Returns true
  [true, 'foobar', 'foo'],
  [true, 'foobar', ''],

  // --- Returns false
  [false, '', 'foo'],
  [false, 'foo', 'bar'],
  [false, undefined, 'bar'],
  [false, 'bar', undefined],
  [false, undefined, undefined],

])('should return %s when checking if %s is a string starting with %s', (expected, value: any, starting: any) => {
  const result = isStringStartingWith(value, starting)
  expect(result).toEqual(expected)
})
