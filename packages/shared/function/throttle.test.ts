
import { expect, it } from 'vitest'
import { sleep } from '../misc/sleep'
import { throttle } from './throttle'

it('throttles a function so it is only called once every delay', async() => {
  let counter = 0
  const throttled = throttle((n = 1) => counter += n, 10)

  // --- First cycle
  throttled(1)
  throttled(1)
  expect(counter).toEqual(1)

  // --- Second cycle (Not unlocked yet)
  await sleep(5)
  expect(counter).toEqual(1)

  // --- Third cycle (Now unlocked)
  await sleep(10)
  throttled(10)
  expect(counter).toEqual(11)
})
