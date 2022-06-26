/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { getType, isType } from './isType'

it('should get the type of a value', () => {
  expect(getType()).toEqual('undefined')
  expect(getType(null)).toEqual('null')
  expect(getType(true)).toEqual('boolean')
  expect(getType(1)).toEqual('number')
  expect(getType(BigInt(1))).toEqual('bigint')
  expect(getType('foo')).toEqual('string')
  expect(getType(Symbol('foo'))).toEqual('symbol')
  expect(getType(() => {})).toEqual('function')
  expect(getType(/foo/)).toEqual('regexp')
  expect(getType(new Date())).toEqual('date')
  expect(getType(new Set())).toEqual('set')
  expect(getType(new Map())).toEqual('map')
  expect(getType(new WeakSet())).toEqual('weakset')
  expect(getType(new WeakMap())).toEqual('weakmap')
  expect(getType([1, 2, 3])).toEqual('array')
  expect(getType({})).toEqual('object')
})

it('should return true if the value is of a specific type', () => {
  expect(isType(undefined, 'undefined')).toEqual(true)
  expect(isType(null, 'null')).toEqual(true)
  expect(isType(true, 'boolean')).toEqual(true)
  expect(isType(1, 'number')).toEqual(true)
  expect(isType(BigInt(1), 'bigint')).toEqual(true)
  expect(isType('foo', 'string')).toEqual(true)
  expect(isType(Symbol('foo'), 'symbol')).toEqual(true)
  expect(isType(() => {}, 'function')).toEqual(true)
  expect(isType(/foo/, 'regexp')).toEqual(true)
  expect(isType(new Date(), 'date')).toEqual(true)
  expect(isType(new Set(), 'set')).toEqual(true)
  expect(isType(new Map(), 'map')).toEqual(true)
  expect(isType(new WeakSet(), 'weakset')).toEqual(true)
  expect(isType(new WeakMap(), 'weakmap')).toEqual(true)
  expect(isType([1, 2, 3], 'array')).toEqual(true)
  expect(isType({}, 'object')).toEqual(true)
})

it('should return fase if the value is not of a specific type', () => {
  expect(isType(undefined, 'null')).toEqual(false)
  expect(isType(null, 'undefined')).toEqual(false)
  expect(isType(true, 'string')).toEqual(false)
  expect(isType(1, 'boolean')).toEqual(false)
  expect(isType(1n, 'number')).toEqual(false)
  expect(isType('foo', 'symbol')).toEqual(false)
  expect(isType(Symbol('foo'), 'string')).toEqual(false)
  expect(isType(() => {}, 'regexp')).toEqual(false)
  expect(isType(/foo/, 'function')).toEqual(false)
  expect(isType(new Date(), 'set')).toEqual(false)
  expect(isType(new Set(), 'date')).toEqual(false)
  expect(isType(new Map(), 'weakset')).toEqual(false)
  expect(isType(new WeakSet(), 'set')).toEqual(false)
  expect(isType(new WeakMap(), 'map')).toEqual(false)
  expect(isType([1, 2, 3], 'object')).toEqual(false)
  expect(isType({}, 'array')).toEqual(false)
})
