/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { noop } from '../misc'
import { isRule } from './isRule'

it('should return true if the value is a ValidationRule as object', () => {
  expect(isRule({ handler: noop })).toEqual(true)
  expect(isRule({ handler: 'noop' })).toEqual(false)
  expect(isRule({ handler: noop, name: noop })).toEqual(false)
  expect(isRule({ handler: noop, name: 'foo' })).toEqual(true)
  expect(isRule({ handler: noop, name: 1 })).toEqual(false)
  expect(isRule({ handler: noop, arguments: noop })).toEqual(true)
  expect(isRule({ handler: noop, arguments: 'foo' })).toEqual(true)
  expect(isRule({ handler: noop, arguments: 1 })).toEqual(true)
  expect(isRule({ handler: noop, errorMessage: 'foo' })).toEqual(true)
  expect(isRule({ handler: noop, errorMessage: noop })).toEqual(true)
  expect(isRule({ handler: noop, errorMessage: 1 })).toEqual(false)
})

it('should return true if the value is a ValidationRule as array', () => {
  expect(isRule([noop])).toEqual(false)
  expect(isRule([noop, 'foo'])).toEqual(true)
  expect(isRule([noop, 'foo', noop])).toEqual(true)
  expect(isRule([noop, 'foo', noop, 1])).toEqual(false)
  expect(isRule([noop, noop])).toEqual(false)
  expect(isRule([noop, noop, noop])).toEqual(false)
  expect(isRule([noop, [noop, 'foo']])).toEqual(false)
})

it('should return true if the value is a ValidationRule as function', () => {
  expect(isRule(noop)).toEqual(true)
})

it('should return false if the value is not a ValidationRule', () => {
  expect(isRule(undefined)).toEqual(false)
  expect(isRule(null)).toEqual(false)
  expect(isRule(0)).toEqual(false)
  expect(isRule(1)).toEqual(false)
  expect(isRule(true)).toEqual(false)
  expect(isRule(false)).toEqual(false)
  expect(isRule('')).toEqual(false)
  expect(isRule('foo')).toEqual(false)
  expect(isRule({})).toEqual(false)
  expect(isRule({ foo: 'bar' })).toEqual(false)
  expect(isRule([])).toEqual(false)
  expect(isRule([1, 2, 3])).toEqual(false)
})
