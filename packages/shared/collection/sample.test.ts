import { expect, it } from 'vitest'
import { sample } from './sample'

it('samples a random item from an array', () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const result = sample(array)
  expect(array).toContain(result)
})

it('samples an array of random items from an array', () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const result = sample(array, 3)
  expect(result.length).toEqual(3)
  expect(array).toContain(result[0])
  expect(array).toContain(result[1])
  expect(array).toContain(result[2])
})

it('should throw an error if the chunk size is less than 1', () => {
  expect(() => sample([1, 2, 3, 4, 5], 0)).toThrowError()
  expect(() => sample([1, 2, 3, 4, 5], -1)).toThrowError()
})

it('should return undefined when sampling a single element from an empty array', () => {
  expect(sample([])).toBeUndefined
})

it('should return a copy of the array when the sample size is the same as the array length', () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  expect(sample(array, array.length)).toEqual(array)
})
