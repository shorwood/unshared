import { expect, it } from 'vitest'
import { some } from './some'

it('should work on arrays', () => {
  expect(some([1, 2, 3, 4], value => value < 10)).toBe(true)
  expect(some([1, 2, 3, 4], value => value % 2 === 0)).toBe(true)
  expect(some([1, 2, 3, 4], 1)).toBe(true)
  expect(some([2, 2, 2, 2], 1)).toBe(false)
})

it('should work on objects', () => {
  expect(some({ a: 1, b: 2, c: 3, d: 4 }, value => value < 10)).toBe(true)
  expect(some({ a: 1, b: 2, c: 3, d: 4 }, value => value % 2 === 0)).toBe(true)
  expect(some({ a: { b: 1 }, c: { b: 2 } }, value => 'b' in value)).toBe(true)
})

it('should return false if object is empty', () => {
  expect(some({}, () => {})).toBe(false)
  expect(some([], () => {})).toBe(false)
})
