import { expect, it } from 'vitest'
import { delay } from './delay'
import { memoize } from './memoize'

it('should memoize a function', async() => {
  const memoizedDateNow = memoize(Date.now)
  const memoizedResult = memoizedDateNow()
  await delay(10)
  expect(memoizedDateNow()).toEqual(memoizedResult)
})
