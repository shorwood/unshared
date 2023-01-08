import { expect, it } from 'vitest'
import { shuffle } from './shuffle'

it('shuffles an array with a seed', () => {
  expect(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0.5)).toEqual([9, 1, 7, 2, 6, 3, 8, 4, 10, 5])
})

it('shuffles an empty array', () => {
  expect(shuffle([])).toEqual([])
})

it('shuffles an empty array with a single item', () => {
  expect(shuffle([1])).toEqual([1])
})
