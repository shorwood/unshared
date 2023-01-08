/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isArray } from './isArray'

it.each([

  // --- Returns true
  [true, []],
  [true, [1, 2, 3]],

  // --- Returns false
  [false, {}],
  [false, null],
  [false, undefined],
  [false, 1],
  [false, 'string'],
  [false, Symbol('symbol')],
  [false, () => {}],
  [false, /regexp/],
  [false, Array],
  [false, new Date()],
  [false, new Set()],
  [false, new Map()],
  [false, new WeakSet()],
  [false, new WeakMap()],

])('should return %s when checking if %s is an array', (expected, value) => {
  const result = isArray(value)
  expect(result).toEqual(expected)
})
