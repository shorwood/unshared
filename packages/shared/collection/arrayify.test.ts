import { expect, it } from 'vitest'
import { arrayify } from './arrayify'

it('should convert value into an array', () => {
  expect(arrayify()).toEqual([])
  expect(arrayify(1)).toEqual([1])
  expect(arrayify([1, 2, 3])).toEqual([1, 2, 3])
})
