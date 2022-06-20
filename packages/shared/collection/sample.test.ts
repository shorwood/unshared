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
