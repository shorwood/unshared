
import { expect, it } from 'vitest'
import { compare } from './compare'

it('compares two strictly equal values', () => {
  expect(compare(0, 0)).toEqual(0)
  expect(compare('', '')).toEqual(0)
  expect(compare(true, true)).toEqual(0)
  expect(compare(false, false)).toEqual(0)
  expect(compare([0], [0])).toEqual(0)
})

it('compares two values of same types', () => {
  expect(compare(0, 1)).toEqual(-1)
  expect(compare(1, 0)).toEqual(1)
  expect(compare('a', 'b')).toEqual(-1)
  expect(compare('b', 'a')).toEqual(1)
  expect(compare(true, false)).toEqual(1)
  expect(compare(false, true)).toEqual(-1)
})

it('compares two values of different types', () => {
  expect(compare(0, '')).toEqual(-1)
  expect(compare('', 0)).toEqual(1)
  expect(compare(0, true)).toEqual(1)
  expect(compare(true, 0)).toEqual(-1)
  expect(compare(0, false)).toEqual(1)
  expect(compare(false, 0)).toEqual(-1)
})

it('compares two arrays of different lengths', () => {
  expect(compare([], [1])).toEqual(-1)
  expect(compare([1], [])).toEqual(1)
  expect(compare([1], [1, 2])).toEqual(-1)
  expect(compare([1, 2], [1])).toEqual(1)
})

it('compares two arrays of different values', () => {
  expect(compare([1], [2])).toEqual(-1)
  expect(compare([2], [1])).toEqual(1)
  expect(compare([1, 2], [1, 3])).toEqual(-1)
  expect(compare([1, 3], [1, 2])).toEqual(1)
})

it('compares two arrays of different order', () => {
  expect(compare([1, 2], [2, 1])).toEqual(-1)
  expect(compare([2, 1], [1, 2])).toEqual(1)
  expect(compare([2, 1, 3], [1, 3, 2])).toEqual(1)
  expect(compare([1, 3, 2], [2, 1, 3])).toEqual(-1)
})

it('compares two objects of different keys', () => {
  expect(compare({}, { a: 1 })).toEqual(-1)
  expect(compare({ a: 1 }, {})).toEqual(1)
  expect(compare({ a: 1 }, { a: 1, b: 2 })).toEqual(-1)
  expect(compare({ a: 1, b: 2 }, { a: 1 })).toEqual(1)
})

it('compares two objects of different values', () => {
  expect(compare({ a: 1 }, { a: 2 })).toEqual(-1)
  expect(compare({ a: 2 }, { a: 1 })).toEqual(1)
})
