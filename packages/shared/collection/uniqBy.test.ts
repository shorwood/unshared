import { expect, it } from 'vitest'
import { uniqBy } from './uniqBy'

it('returns a new array containing only unique items, based on a given key', () => {
  const input = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'John' },
  ]
  const expected = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ]
  expect(uniqBy(input, 'name')).toEqual(expected)
})
