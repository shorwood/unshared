import { expect, it } from 'vitest'
import { mapKeys } from './mapKeys'

it('should map keys in an object', () => {
  const object = {
    1: { id: 1, name: 'One' },
    2: { id: 2, name: 'Two' },
    3: { id: 3, name: 'Three' },
  }
  const result = mapKeys(object, 'name')
  expect(result).toEqual({
    One: { id: 1, name: 'One' },
    Two: { id: 2, name: 'Two' },
    Three: { id: 3, name: 'Three' },
  })
})

it('should map keys in an array', () => {
  const array = [
    { id: 1, name: 'One' },
    { id: 2, name: 'Two' },
    { id: 3, name: 'Three' },
  ]
  const result = mapKeys(array, 'name')
  expect(result).toEqual({
    One: { id: 1, name: 'One' },
    Two: { id: 2, name: 'Two' },
    Three: { id: 3, name: 'Three' },
  })
})

it('should return an empty object when passed an empty object', () => {
  expect(mapKeys({}, 'id')).toEqual({})
})

it('should return an empty object when passed an empty array', () => {
  expect(mapKeys([], 'id')).toEqual({})
})
