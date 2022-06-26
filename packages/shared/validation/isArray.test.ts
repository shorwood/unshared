import { expect, it } from 'vitest'
import {
  isArray,
  isArrayEmpty,
  isArrayIncluding,
  isArrayIncludingEvery,
  isArrayIncludingSome,
  isArrayNotEmpty,
  isArrayNotIncluding,
  isArrayNotIncludingEvery,
  isArrayNotIncludingSome,
  isArrayValid,
} from './isArray'

it('checks if value is an array', () => {
  expect(isArray([1, 2, 3])).toEqual(true)
  expect(isArray([])).toEqual(true)
  expect(isArray({})).toEqual(false)
  expect(isArray(1)).toEqual(false)
  expect(isArray('Array')).toEqual(false)
})

it('checks if array is empty', () => {
  expect(isArrayEmpty([])).toEqual(true)
  expect(isArrayEmpty([1, 2, 3])).toEqual(false)
})

it('checks if array is not empty', () => {
  expect(isArrayNotEmpty([])).toEqual(false)
  expect(isArrayNotEmpty([1, 2, 3])).toEqual(true)
})

it('checks if array includes value', () => {
  expect(isArrayIncluding([1, 2, 3], 1)).toEqual(true)
  expect(isArrayIncluding([1, 2, 3], 4)).toEqual(false)
  expect(isArrayIncluding([], 1)).toEqual(false)
})

it('checks if array includes some', () => {
  expect(isArrayIncludingSome([1, 2, 3], [1, 4, 5])).toEqual(true)
  expect(isArrayIncludingSome([1, 2, 3], [4, 5])).toEqual(false)
  expect(isArrayIncludingSome([], [1, 4, 5])).toEqual(false)
})

it('checks if array includes every', () => {
  expect(isArrayIncludingEvery([1, 2, 3], [1, 3])).toEqual(true)
  expect(isArrayIncludingEvery([1, 2, 3], [1, 4])).toEqual(false)
  expect(isArrayIncludingEvery([], [1, 3])).toEqual(false)
})

it('checks if array does not includes value', () => {
  expect(isArrayNotIncluding([1, 2, 3], 1)).toEqual(false)
  expect(isArrayNotIncluding([1, 2, 3], 4)).toEqual(true)
  expect(isArrayNotIncluding([], 1)).toEqual(true)
})

it('checks if array does not includes some', () => {
  expect(isArrayNotIncludingSome([1, 2, 3], [1, 4, 5])).toEqual(true)
  expect(isArrayNotIncludingSome([1, 2, 3], [4, 5])).toEqual(true)
  expect(isArrayNotIncludingSome([1, 2, 3], [1, 2, 3])).toEqual(false)
  expect(isArrayNotIncludingSome([], [1, 4, 5])).toEqual(true)
})

it('checks if array does not includes every', () => {
  expect(isArrayNotIncludingEvery([1, 2, 3], [1, 4, 5])).toEqual(false)
  expect(isArrayNotIncludingEvery([1, 2, 3], [4, 5])).toEqual(true)
  expect(isArrayNotIncludingEvery([1, 2, 3], [1, 2, 3])).toEqual(false)
  expect(isArrayNotIncludingEvery([], [1, 3])).toEqual(true)
})

const isNumber = (v: any) => typeof v === 'number'
const isString = (v: any) => typeof v === 'string'

it('checks if array does not includes every', async() => {
  expect(await isArrayValid([1, 2, 3], isNumber)).toEqual(true)
  expect(await isArrayValid(['1', '2', '3'], isString)).toEqual(true)
  expect(await isArrayValid([true, 2, '3'], isString)).toEqual(false)
})
