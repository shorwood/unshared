import { expect, it } from 'vitest'
import { some } from './some'

it('should work on arrays', () => {
  expect(some([1, 2, 3, 4], value => value < 10)).toEqual(true)
  expect(some([1, 2, 3, 4], value => value % 2 === 0)).toEqual(true)
  expect(some([1, 2, 3, 4], 1)).toEqual(true)
  expect(some([2, 2, 2, 2], 1)).toEqual(false)
})

it('should work on objects', () => {
  expect(some({ a: 1, b: 2, c: 3, d: 4 }, value => value < 10)).toEqual(true)
  expect(some({ a: 1, b: 2, c: 3, d: 4 }, value => value % 2 === 0)).toEqual(true)
  expect(some({ a: { b: 1 }, c: { b: 2 } }, value => 'b' in value)).toEqual(true)
})

it('should return false if object is empty', () => {
  expect(some({}, () => {})).toEqual(false)
  expect(some([], () => {})).toEqual(false)
})
