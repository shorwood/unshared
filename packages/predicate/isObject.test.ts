/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isObject } from './isObject'

it.each([

  // --- Returns true
  [true, {}],
  [true, { foo: 'bar' }],
  [true, new Map()],

  // --- Returns false
  [false, null],
  [false, undefined],
  [false, ''],
  [false, 0],
  [false, true],
  [false, Symbol('foo')],
  [false, []],

])('should return %s when checking if %s is an object', (expected, value) => {
  const result = isObject(value)
  expect(result).toEqual(expected)
})
