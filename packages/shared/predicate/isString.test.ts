/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isString } from './isString'

it.each([
  // --- Returns true
  [true, ''],
  [true, 'foo'],

  // --- Returns false
  [false, undefined],
  [false, null],
  [false, 1],
  [false, []],
  [false, {}],
  [false, () => {}],
  [false, Symbol('foo')],

])('should return %s when checking if %s is a string', (expected, value) => {
  const result = isString(value)
  expect(result).toEqual(expected)
})
