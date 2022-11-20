/* eslint-disable @typescript-eslint/no-unused-vars */
import { createHash, randomBytes } from 'node:crypto'
import { expect, it } from 'vitest'
import { benchmark } from './benchmark'

const toBenchmark = () => {
  const secret = randomBytes(1024)
  return createHash('sha512').update(secret).digest('base64')
}

it('should benchmark a function', async() => {
  // --- Do something that takes time
  const result = await benchmark(toBenchmark, {
    iterations: 10,
    coldStart: true,
  })

  expect(result.iterations).toEqual(10)
  expect(result.total).toBeGreaterThan(0)
  expect(result.memory).toBeGreaterThan(0)
  expect(result.average).toBeGreaterThan(0)
})
