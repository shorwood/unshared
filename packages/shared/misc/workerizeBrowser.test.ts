import { expect, it } from 'vitest'
import { isBrowser } from './environment'
import { workerizeBrowser } from './workerizeBrowser'

it.skipIf(!isBrowser)('should wrap a function and return a promise', async() => {
  const wrapped = workerizeBrowser((x: number) => x + 5)
  expect(await wrapped(10)).toEqual(15)
})
