import { expect, it } from 'vitest'
import { sortBy } from './sortBy'

it('sorts an array by the result of an iterator function', () => {
  const array = [1, 2, 3]
  const result = sortBy(array, x => x * -1)
  expect(result.length).toEqual(array.length)
  expect(result).toEqual([3, 2, 1])
})

it('sorts an array by the result of a path', () => {
  const array = [{ a: 3 }, { a: 2 }, { a: 1 }]
  const result = sortBy(array, 'a')
  expect(result.length).toEqual(array.length)
  expect(result).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }])
})
