
import { expect, it } from 'vitest'
import { clamp } from './clamp'

it('should clamp the number between the minimum and maximum value', () => {
  expect(clamp(-20, -10, 10)).toEqual(-10)
  expect(clamp(20, -10, 10)).toEqual(10)
  expect(clamp(0, -10, 10)).toEqual(0)
})

it('should clamp negative zero to positive zero', () => {
  expect(clamp(-0, 0, 10)).toEqual(0)
  expect(clamp(-0, -10, 0)).toEqual(0)
})
