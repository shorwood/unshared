/* eslint-disable unicorn/consistent-function-scoping */
import { expect, it } from 'vitest'
import { chunk } from './chunk'

it.each([
  [3, [1, 2, 3], [4, 5, 6], [7, 8, 9]],
  [2, [1, 2], [3, 4], [5, 6], [7, 8], [9]],
  [1, [1], [2], [3], [4], [5], [6], [7], [8], [9]],
])('should split an array into chunks of size %s', (size, ...expected) => {
  const result = chunk([1, 2, 3, 4, 5, 6, 7, 8, 9], size)
  expect(result).toEqual(expected)
})

it('should split even if the array size is smaller than the chunk size', () => {
  const result = chunk([1, 2, 3], 4)
  expect(result).toEqual([[1, 2, 3]])
})

it('should not chunk empty arrays', () => {
  const result = chunk([], 10)
  expect(result).toEqual([])
})

it('should throw an error if the chunk size is less than 1', () => {
  const shouldThrow = () => chunk([1, 2, 3], 0)
  expect(shouldThrow).toThrowError()
})
