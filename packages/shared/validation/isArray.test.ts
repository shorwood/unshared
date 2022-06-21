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
} from './isArray'

it('checks if value is an array', () => {
  expect(isArray([1, 2, 3])).toBeTruthy()
  expect(isArray([])).toBeTruthy()
  expect(isArray({})).toBeFalsy()
  expect(isArray(1)).toBeFalsy()
  expect(isArray('Array')).toBeFalsy()
})

it('checks if array is empty', () => {
  expect(isArrayEmpty([])).toBeTruthy()
  expect(isArrayEmpty([1, 2, 3])).toBeFalsy()
})

it('checks if array is not empty', () => {
  expect(isArrayNotEmpty([])).toBeFalsy()
  expect(isArrayNotEmpty([1, 2, 3])).toBeTruthy()
})

it('checks if array includes value', () => {
  expect(isArrayIncluding([1, 2, 3], 1)).toBeTruthy()
  expect(isArrayIncluding([1, 2, 3], 4)).toBeFalsy()
  expect(isArrayIncluding([], 1)).toBeFalsy()
})

it('checks if array includes some', () => {
  expect(isArrayIncludingSome([1, 2, 3], [1, 4, 5])).toBeTruthy()
  expect(isArrayIncludingSome([1, 2, 3], [4, 5])).toBeFalsy()
  expect(isArrayIncludingSome([], [1, 4, 5])).toBeFalsy()
})

it('checks if array includes every', () => {
  expect(isArrayIncludingEvery([1, 2, 3], [1, 3])).toBeTruthy()
  expect(isArrayIncludingEvery([1, 2, 3], [1, 4])).toBeFalsy()
  expect(isArrayIncludingEvery([], [1, 3])).toBeFalsy()
})

it('checks if array does not includes value', () => {
  expect(isArrayNotIncluding([1, 2, 3], 1)).toBeFalsy()
  expect(isArrayNotIncluding([1, 2, 3], 4)).toBeTruthy()
  expect(isArrayNotIncluding([], 1)).toBeTruthy()
})

it('checks if array does not includes some', () => {
  expect(isArrayNotIncludingSome([1, 2, 3], [1, 4, 5])).toBeTruthy()
  expect(isArrayNotIncludingSome([1, 2, 3], [4, 5])).toBeTruthy()
  expect(isArrayNotIncludingSome([1, 2, 3], [1, 2, 3])).toBeFalsy()
  expect(isArrayNotIncludingSome([], [1, 4, 5])).toBeTruthy()
})

it('checks if array does not includes every', () => {
  expect(isArrayNotIncludingEvery([1, 2, 3], [1, 4, 5])).toBeFalsy()
  expect(isArrayNotIncludingEvery([1, 2, 3], [4, 5])).toBeTruthy()
  expect(isArrayNotIncludingEvery([1, 2, 3], [1, 2, 3])).toBeFalsy()
  expect(isArrayNotIncludingEvery([], [1, 3])).toBeTruthy()
})
