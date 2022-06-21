/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { noop } from '../misc'
import { isRule } from './isRule'

it('should return true if the value is a ValidationRule as object', () => {
  expect(isRule({ handler: noop })).toBeTruthy()
  expect(isRule({ handler: 'noop' })).toBeFalsy()
  expect(isRule({ handler: noop, name: 'foo' })).toBeTruthy()
  expect(isRule({ handler: noop, arguments: (result: any) => result })).toBeTruthy()
  expect(isRule({ handler: noop, errorMessage: 'foo' })).toBeTruthy()
})

it('should return true if the value is a ValidationRule as array', () => {
  expect(isRule([noop])).toBeFalsy()
  expect(isRule([noop, 'foo'])).toBeTruthy()
  expect(isRule([noop, 'foo', noop])).toBeTruthy()
  expect(isRule([noop, noop])).toBeFalsy()
  expect(isRule([noop, noop, noop])).toBeFalsy()
  expect(isRule([noop, [noop, 'foo']])).toBeFalsy()
})

it('should return true if the value is a ValidationRule as function', () => {
  expect(isRule(noop)).toBeTruthy()
})

it('should return false if the value is not a ValidationRule', () => {
  expect(isRule(undefined)).toBeFalsy()
  expect(isRule(null)).toBeFalsy()
  expect(isRule(0)).toBeFalsy()
  expect(isRule(1)).toBeFalsy()
  expect(isRule(true)).toBeFalsy()
  expect(isRule(false)).toBeFalsy()
  expect(isRule('')).toBeFalsy()
  expect(isRule('foo')).toBeFalsy()
  expect(isRule({})).toBeFalsy()
  expect(isRule({ foo: 'bar' })).toBeFalsy()
  expect(isRule([])).toBeFalsy()
  expect(isRule([1, 2, 3])).toBeFalsy()
})
