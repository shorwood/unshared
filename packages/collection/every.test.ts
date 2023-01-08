import { expect, it } from 'vitest'
import { every } from './every'

it('should work on arrays', () => {
  expect(every([1, 2, 3, 4], value => value < 10)).toEqual(true)
  expect(every([1, 2, 3, 4], value => value % 2 === 0)).toEqual(false)
  expect(every([1, 1, 1, 1], 1)).toEqual(true)
  expect(every([1, 1, 1, 2], 1)).toEqual(false)
})

it('should work on objects', () => {
  expect(every({ a: 1, b: 2, c: 3, d: 4 }, value => value < 10)).toEqual(true)
  expect(every({ a: 1, b: 2, c: 3, d: 4 }, value => value % 2 === 0)).toEqual(false)
  expect(every({ a: { b: 1 }, c: { b: 2 } }, value => 'b' in value)).toEqual(true)
})

it('should return false if object is empty', () => {
  expect(every({}, () => {})).toEqual(true)
  expect(every([], () => {})).toEqual(true)
})
