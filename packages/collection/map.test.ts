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
  expect(map({ a: 1, b: 2, c: 3 }, (x, k) => x + k)).toEqual(['1a', '2b', '3c'])
  expect(map('abc', x => x.charCodeAt(0))).toEqual([97, 98, 99])
  expect(map('abc', (_x, _k, o) => o)).toEqual(['abc', 'abc', 'abc'])
})

it('iterates over an array, returning a new array consisting of the results of the path', () => {
  const object1 = { foo: 'foo', bar: undefined }
  const object2 = { foo: object1, bar: object1 }
  expect(map([object2, object2, object2], 'foo.foo')).toEqual(['foo', 'foo', 'foo'])
  expect(map({ a: object2, b: object2, c: object2 }, 'foo.bar')).toEqual([undefined, undefined, undefined])
})

it('returns input values if no secondary parameter was provided', () => {
  expect(map([{ a: 1 }, { a: 2 }, { a: 3 }])).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
  expect(map({ a: 1, b: 2, c: 3 })).toEqual([1, 2, 3])
})
