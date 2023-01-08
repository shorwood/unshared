import { expect, it } from 'vitest'
import { uniq } from './uniq'

it('returns a new array with only unique values from the given array', () => {
  expect(uniq([1, 2, 3, 3, 4, 4, 5])).toEqual([1, 2, 3, 4, 5])
  expect(uniq(['a', 'a', 'b', 'b', 'c', 'c'])).toEqual(['a', 'b', 'c'])
})
