/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isObject, isObjectConverging, isObjectEqual } from './isObject'

it('returns true if the value is an object', () => {
  expect(isObject(1)).toEqual(false)
  expect(isObject('1')).toEqual(false)
  expect(isObject(true)).toEqual(false)
  expect(isObject(false)).toEqual(false)
  expect(isObject(undefined)).toEqual(false)
  expect(isObject(null)).toEqual(false)
  expect(isObject([])).toEqual(false)
  expect(isObject({})).toEqual(true)
})

it('returns true if object can be merged without changing any values', () => {
  const object = { foo: 1, bar: 2 }
  expect(isObjectConverging({}, {})).toEqual(true)
  expect(isObjectConverging(object, object)).toEqual(true)
  expect(isObjectConverging({ a: 1 }, { a: 1 })).toEqual(true)
  expect(isObjectConverging({ a: 1 }, { a: 2 })).toEqual(false)
  expect(isObjectConverging({ a: 1 }, { b: 1 })).toEqual(true)
  expect(isObjectConverging({ a: 1 }, { a: 1, b: 1 })).toEqual(true)
})

it('returns true if objects are equal', () => {
  const object = { foo: 1, bar: 2 }
  expect(isObjectEqual({}, {})).toEqual(true)
  expect(isObjectEqual(object, object)).toEqual(true)
  expect(isObjectEqual({ a: 1 }, { a: 1 })).toEqual(true)
  expect(isObjectEqual({ a: 1 }, { a: 2 })).toEqual(false)
  expect(isObjectEqual({ a: 1 }, { b: 1 })).toEqual(false)
  expect(isObjectEqual({ a: 1 }, { a: 1, b: 1 })).toEqual(false)
})
