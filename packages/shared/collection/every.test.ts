import { expect, it } from 'vitest'
import { every } from './every'

it('should work on arrays', () => {
  expect(every([1, 2, 3, 4], value => value < 10)).toBe(true)
  expect(every([1, 2, 3, 4], value => value % 2 === 0)).toBe(false)
  expect(every([1, 1, 1, 1], 1)).toBe(true)
  expect(every([1, 1, 1, 2], 1)).toBe(false)
})

it('should work on objects', () => {
  expect(every({ a: 1, b: 2, c: 3, d: 4 }, value => value < 10)).toBe(true)
  expect(every({ a: 1, b: 2, c: 3, d: 4 }, value => value % 2 === 0)).toBe(false)
  expect(every({ a: { b: 1 }, c: { b: 2 } }, value => 'b' in value)).toBe(true)
})

it('should return false if object is empty', () => {
  expect(every({}, () => {})).toBe(true)
  expect(every([], () => {})).toBe(true)
})
