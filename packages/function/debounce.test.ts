import { expect, it } from 'vitest'
import { sleep } from '@unshared-dev/misc/sleep'
import { debounce } from './debounce'

it('debounces a function so it is only called once after delay', async() => {
  let counter = 0
  const debounced = debounce(() => counter++, 10)

  // --- First cycle
  debounced()
  debounced()
  expect(counter).toEqual(0)

  // --- Third cycle
  await sleep(10)
  expect(counter).toEqual(1)
  debounced()
  expect(counter).toEqual(1)
})

it('throws if delay is lower than 1', () => {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const shouldThrow = () => debounce(() => {}, 0)
  expect(shouldThrow).toThrow()
})
