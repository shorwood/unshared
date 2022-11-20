import { expect, it } from 'vitest'
import { sleep } from '../misc/sleep'
import { memoize } from './memoize'

it('should memoize a function', async() => {
  const memoizedDateNow = memoize(Date.now)
  const memoizedResult = memoizedDateNow()
  await sleep(10)
  expect(memoizedDateNow()).toEqual(memoizedResult)
})
