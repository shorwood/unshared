/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isBoolean, isFalse, isFalsy, isTrue, isTruthy } from './isBoolean'

it('should check if value is a boolean', () => {
  expect(isBoolean(true)).toEqual(true)
  expect(isBoolean(false)).toEqual(true)
  expect(isBoolean(null)).toEqual(false)
  expect(isBoolean(undefined)).toEqual(false)
  expect(isBoolean(0)).toEqual(false)
  expect(isBoolean('')).toEqual(false)
  expect(isBoolean({})).toEqual(false)
  expect(isBoolean([])).toEqual(false)
  expect(isBoolean(Symbol('test'))).toEqual(false)
  expect(isBoolean(() => {})).toEqual(false)
})

it('should check if value is truthy', () => {
  expect(isTruthy(true)).toEqual(true)
  expect(isTruthy(false)).toEqual(false)
  expect(isTruthy(null)).toEqual(false)
  expect(isTruthy(undefined)).toEqual(false)
  expect(isTruthy(0)).toEqual(false)
  expect(isTruthy('')).toEqual(false)
  expect(isTruthy({})).toEqual(true)
  expect(isTruthy([])).toEqual(true)
  expect(isTruthy(Symbol('test'))).toEqual(true)
  expect(isTruthy(() => {})).toEqual(true)
})

it('should check if value is falsy', () => {
  expect(isFalsy(true)).toEqual(false)
  expect(isFalsy(false)).toEqual(true)
  expect(isFalsy(null)).toEqual(true)
  expect(isFalsy(undefined)).toEqual(true)
  expect(isFalsy(0)).toEqual(true)
  expect(isFalsy('')).toEqual(true)
  expect(isFalsy({})).toEqual(false)
  expect(isFalsy([])).toEqual(false)
  expect(isFalsy(Symbol('test'))).toEqual(false)
  expect(isFalsy(() => {})).toEqual(false)
})

it('should check if value is true', () => {
  expect(isTrue(true)).toEqual(true)
  expect(isTrue(false)).toEqual(false)
})

it('should check if value is false', () => {
  expect(isFalse(true)).toEqual(false)
  expect(isFalse(false)).toEqual(true)
})
