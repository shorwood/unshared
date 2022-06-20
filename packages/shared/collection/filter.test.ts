import { expect, it } from 'vitest'
import { filter } from './filter'

it('filters values from an array', () => {
  expect(filter([2, 2, 3, 4, 5], [2, 3, 5])).toEqual([2, 2, 3, 5])
})

it('filters values from a value', () => {
  expect(filter([2, 2, 3, 4, 5], 2)).toEqual([2, 2])
})

it('filters values from an array according to a predicate function', () => {
  expect(filter([2, 2, 3, 4, 5], value => value % 2 === 0)).toEqual([2, 2, 4])
})
