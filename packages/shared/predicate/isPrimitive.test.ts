/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isPrimitive } from './isPrimitive'

it.each([

  // --- Returns true
  [true, 1],
  [true, 1n],
  [true, '1'],
  [true, Symbol('1')],
  [true, true],
  [true, undefined],
  [true, null],

  // --- Returns false
  [false, {}],
  [false, []],
  [false, () => {}],

])('should return %s when checking if %s is a primitive', (expected, value) => {
  const result = isPrimitive(value)
  expect(result).toEqual(expected)
})
