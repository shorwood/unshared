/* eslint-disable @typescript-eslint/no-unused-vars */
import { expect, it } from 'vitest'
import { benchmark } from './benchmark'

it('should benchmark a function', async() => {
  // --- Do something that takes time
  const averageTime = benchmark(() => {
    let x = 0
    for (let index = 0; index < 100000; index++) x += index
  }, 1000)

  expect(averageTime).toBeGreaterThanOrEqual(0)
})
