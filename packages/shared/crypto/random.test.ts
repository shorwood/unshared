import { expect, it } from 'vitest'
import { random } from './random'

it.each(Array.from({ length: 10 }))('returns a random number (#%#)', () => {
  const result = random()
  expect(result).toBeTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER)
  expect(result).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER)
})
