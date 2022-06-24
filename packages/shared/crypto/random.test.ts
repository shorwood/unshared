import { expect, it } from 'vitest'
import { random } from './random'

it('returns a random number', () => {
  expect(random()).toBeTypeOf('number')
  expect(random()).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER)
  expect(random()).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER)
})
