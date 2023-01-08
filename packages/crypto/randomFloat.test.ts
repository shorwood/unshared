import { expect, it } from 'vitest'
import { randomFloat } from './randomFloat'

it('returns a random float between 0 and 1', () => {
  const result = randomFloat()
  expect(result).toBeTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(0)
  expect(result).toBeLessThanOrEqual(1)
})

it('returns a random float between min and max', () => {
  const result = randomFloat(10, 20)
  expect(result).toBeTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(10)
  expect(result).toBeLessThanOrEqual(20)
})
