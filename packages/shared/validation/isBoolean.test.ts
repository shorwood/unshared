/* eslint-disable unicorn/no-useless-undefined */
/* eslint-disable unicorn/no-null */
import { expect, it } from 'vitest'
import { isBoolean, isFalse, isFalsy, isTrue, isTruthy } from './isBoolean'

it('should check if value is a boolean', () => {
  expect(isBoolean(true)).toBe(true)
  expect(isBoolean(false)).toBe(true)
  expect(isBoolean(null)).toBe(false)
  expect(isBoolean(undefined)).toBe(false)
  expect(isBoolean(0)).toBe(false)
  expect(isBoolean('')).toBe(false)
  expect(isBoolean({})).toBe(false)
  expect(isBoolean([])).toBe(false)
  expect(isBoolean(Symbol('test'))).toBe(false)
  expect(isBoolean(() => {})).toBe(false)
})

it('should check if value is truthy', () => {
  expect(isTruthy(true)).toBe(true)
  expect(isTruthy(false)).toBe(false)
  expect(isTruthy(null)).toBe(false)
  expect(isTruthy(undefined)).toBe(false)
  expect(isTruthy(0)).toBe(false)
  expect(isTruthy('')).toBe(false)
  expect(isTruthy({})).toBe(true)
  expect(isTruthy([])).toBe(true)
  expect(isTruthy(Symbol('test'))).toBe(true)
  expect(isTruthy(() => {})).toBe(true)
})

it('should check if value is falsy', () => {
  expect(isFalsy(true)).toBe(false)
  expect(isFalsy(false)).toBe(true)
  expect(isFalsy(null)).toBe(true)
  expect(isFalsy(undefined)).toBe(true)
  expect(isFalsy(0)).toBe(true)
  expect(isFalsy('')).toBe(true)
  expect(isFalsy({})).toBe(false)
  expect(isFalsy([])).toBe(false)
  expect(isFalsy(Symbol('test'))).toBe(false)
  expect(isFalsy(() => {})).toBe(false)
})

it('should check if value is true', () => {
  expect(isTrue(true)).toBe(true)
  expect(isTrue(false)).toBe(false)
})

it('should check if value is false', () => {
  expect(isFalse(true)).toBe(false)
  expect(isFalse(false)).toBe(true)
})
