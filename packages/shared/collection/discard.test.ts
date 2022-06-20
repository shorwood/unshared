import { expect, it } from 'vitest'
import { discard } from './discard'

it('discards values from an array', () => {
  expect(discard([2, 2, 3, 4, 5], [2, 3])).toEqual([4, 5])
})

it('discards values from a value', () => {
  expect(discard([2, 2, 3, 4, 5], 2)).toEqual([3, 4, 5])
})

it('discards values from an array according to a predicate function', () => {
  expect(discard([2, 2, 3, 4, 5], value => value % 2 === 0)).toEqual([3, 5])
})
