import { expect, it } from 'vitest'
import { sleep } from './sleep'

it('delay execution by ms milliseconds', async() => {
  const start = Date.now()
  await sleep(100)
  expect(Date.now() - start).toBeGreaterThanOrEqual(100)
})
