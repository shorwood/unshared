import { expect, it } from 'vitest'
import { map } from './map'

it('iterates over an array, returning a new array consisting of the results of the callback function', () => {
  expect(map([1, 2, 3], x => x)).toEqual([1, 2, 3])
  expect(map([1, 2, 3], x => x * x)).toEqual([1, 4, 9])
  expect(map([1, 2, 3], x => x + 1)).toEqual([2, 3, 4])
  expect(map([1, 2, 3], (x, index) => x + index)).toEqual([1, 3, 5])
})

it('iterates over an object, returning a new array consisting of the results of the callback function', () => {
  expect(map({ a: 1, b: 2, c: 3 }, x => x)).toEqual([1, 2, 3])
  expect(map({ a: 1, b: 2, c: 3 }, x => x * x)).toEqual([1, 4, 9])
  expect(map({ a: 1, b: 2, c: 3 }, x => x + 1)).toEqual([2, 3, 4])
  expect(map({ a: 1, b: 2, c: 3 }, (x, key) => x + key)).toEqual(['1a', '2b', '3c'])
})

it('iterates over an array, returning a new array consisting of the results of the path', () => {
  expect(map([{ a: 1 }, { a: 2 }, { a: 3 }], 'a')).toEqual([1, 2, 3])
  expect(map({ a: { a: 1 }, b: { a: 2 }, c: { a: 3 } }, 'a')).toEqual([1, 2, 3])
})
