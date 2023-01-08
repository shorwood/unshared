import { expect, it } from 'vitest'
import { discard } from './discard'

it('discards values from an array', () => {
  const result = discard([2, 2, 3, 4, 5], [2, 3])
  expect(result).toEqual([4, 5])
})

it('discards values from a value', () => {
  const result = discard([2, 2, 3, 4, 5], 3)
  expect(result).toEqual([2, 2, 4, 5])
})

it('discards values from an array according to a predicate function', () => {
  const result = discard([2, 2, 3, 4, 5], value => value % 2 === 0)
  expect(result).toEqual([3, 5])
})
