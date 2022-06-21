/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isNil, isNotNil, isNotNull, isNotUndefined, isNull, isUndefined } from './isNil'

it('checks if value is null', () => {
  expect(isNull(null)).toBe(true)
  expect(isNull(1)).toBe(false)
})

it('checks if value is undefined', () => {
  expect(isUndefined(undefined)).toBe(true)
  expect(isUndefined(1)).toBe(false)
})

it('checks if value is null or undefined', () => {
  expect(isNil(undefined)).toBe(true)
  expect(isNil(null)).toBe(true)
  expect(isNil(1)).toBe(false)
})

it('checks if value is not null or undefined', () => {
  expect(isNotNil(undefined)).toBe(false)
  expect(isNotNil(null)).toBe(false)
  expect(isNotNil(1)).toBe(true)
})

it('checks if value is not null', () => {
  expect(isNotNull(1)).toBe(true)
  expect(isNotNull(null)).toBe(false)
})

it('checks if value is not undefined', () => {
  expect(isNotUndefined(1)).toBe(true)
  expect(isNotUndefined(undefined)).toBe(false)
})
