import { expect, it } from 'vitest'
import { delay } from './delay'

it('delay execution by ms milliseconds', async() => {
  const start = Date.now()
  await delay(100)
  expect(Date.now() - start).toBeGreaterThanOrEqual(100)
})
