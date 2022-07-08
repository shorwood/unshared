/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { kindOf } from './kindOf'

it.each([

  ['undefined', undefined],
  ['null', null],
  ['number', 1],
  ['string', '1'],
  ['boolean', true],
  ['bigint', 42n],
  ['symbol', Symbol('foo')],
  ['function', () => {}],
  ['RegExp', /foo/],
  ['Date', new Date()],
  ['Set', new Set()],
  ['Map', new Map()],
  ['WeakSet', new WeakSet()],
  ['WeakMap', new WeakMap()],
  ['object', {}],

])('should return %s when checking kind of %s', (expected, value) => {
  const result = kindOf(value)
  expect(result).toBe(expected)
})
