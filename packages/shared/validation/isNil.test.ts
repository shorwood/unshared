/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/no-useless-undefined */
import { expect, it } from 'vitest'
import { isNil, isNotNil, isNotNull, isNotUndefined, isNull, isUndefined } from './isNil'

it('checks if value is null', () => {
  expect(isNull(null)).toEqual(true)
  expect(isNull(1)).toEqual(false)
})

it('checks if value is undefined', () => {
  expect(isUndefined(undefined)).toEqual(true)
  expect(isUndefined(1)).toEqual(false)
})

it('checks if value is null or undefined', () => {
  expect(isNil(undefined)).toEqual(true)
  expect(isNil(null)).toEqual(true)
  expect(isNil(1)).toEqual(false)
})

it('checks if value is not null or undefined', () => {
  expect(isNotNil(undefined)).toEqual(false)
  expect(isNotNil(null)).toEqual(false)
  expect(isNotNil(1)).toEqual(true)
})

it('checks if value is not null', () => {
  expect(isNotNull(1)).toEqual(true)
  expect(isNotNull(null)).toEqual(false)
})

it('checks if value is not undefined', () => {
  expect(isNotUndefined(1)).toEqual(true)
  expect(isNotUndefined(undefined)).toEqual(false)
})
