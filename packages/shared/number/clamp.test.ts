
import { expect, it } from 'vitest'
import { clamp } from './clamp'

it('should clamp the number to the minimum value', () => {
  expect(clamp(0, 1, 10)).toBe(1)
})

it('should clamp the number to the maximum value', () => {
  expect(clamp(20, 1, 10)).toBe(10)
})

it('should not clamp the number if it is between the minimum and maximum values', () => {
  expect(clamp(5, 1, 10)).toBe(5)
})
