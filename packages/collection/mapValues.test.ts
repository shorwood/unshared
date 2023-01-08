import { expect, it } from 'vitest'
import { mapValues } from './mapValues'

it('should map values of an array', () => {
  expect(mapValues([1, 2, 3], value => value * 2)).toEqual([2, 4, 6])
})

it('should map values of an object', () => {
  expect(mapValues({ a: 1, b: 2, c: 3 }, value => value * 2)).toEqual({ a: 2, b: 4, c: 6 })
})

it('should map values of an array according to a key path', () => {
  expect(mapValues([{ name: 'John' }, { name: 'Jane' }, { name: 'Joe' }], 'name')).toEqual([
    'John',
    'Jane',
    'Joe',
  ])
})

it('should map values of an object according to a key path', () => {
  expect(mapValues({ 1: { name: 'John' }, 2: { name: 'Jane' }, 3: { name: 'Joe' } }, 'name')).toEqual({
    1: 'John',
    2: 'Jane',
    3: 'Joe',
  })
})
