import { expect, it } from 'vitest'
import { arrayify } from './arrayify'

it('should return the array if the value is an array', () => {
  const result = arrayify([1, 2, 3])
  expect(result).toEqual([1, 2, 3])
})

it('should return an array with the value if the value is not an array', () => {
  const result = arrayify(1)
  expect(result).toEqual([1])
})

it('should return an empty array if the value is undefined', () => {
  const result = arrayify()
  expect(result).toEqual([])
})
