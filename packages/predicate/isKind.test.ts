/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isKind } from './isKind'

it.each([

  // --- Returns true
  [true, true, 'boolean'],
  [true, 1, 'number'],
  [true, '1', 'string'],
  [true, Symbol('foo'), 'symbol'],
  [true, () => {}, 'function'],
  [true, /foo/, 'RegExp'],
  [true, new Date(), 'Date'],
  [true, new Set(), 'Set'],
  [true, new Map(), 'Map'],
  [true, new WeakSet(), 'WeakSet'],
  [true, new WeakMap(), 'WeakMap'],
  [true, [], 'array'],
  [true, {}, 'object'],
  [true, undefined, 'undefined'],
  [true, null, 'null'],

  // --- Returns true (one of the kinds)
  [true, true, ['boolean']],
  [true, true, ['number', 'boolean']],

  // --- Returns false
  [false, 1, 'boolean'],
  [false, 1, ['boolean']],
  [false, 1, ['boolean', 'string']],

])('should return %s when checking if %s is a %s', (expected, value, kind) => {
  const result = isKind(value, kind)
  expect(result).toEqual(expected)
})
