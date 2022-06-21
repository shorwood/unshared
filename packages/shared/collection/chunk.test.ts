import { expect, it } from 'vitest'
import { chunk } from './chunk'

it('should split an array into smaller arrays of a specified size', () => {
  expect(chunk([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)).toEqual([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ])
  expect(chunk([1, 2, 3, 4, 5, 6, 7, 8, 9], 2)).toEqual([
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
    [9],
  ])
})

it('should split even if the array size is smaller than the chunk size', () => {
  expect(chunk([1, 2, 3, 4, 5], 6)).toEqual([
    [1, 2, 3, 4, 5],
  ])
})

it('should not chunk empty arrays', () => {
  expect(chunk([], 11)).toEqual([])
})

it('should throw an error if the chunk size is less than 1', () => {
  expect(() => chunk([1, 2, 3, 4, 5], 0)).toThrowError()
  expect(() => chunk([1, 2, 3, 4, 5], -1)).toThrowError()
})
