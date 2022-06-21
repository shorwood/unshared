import { expect, it } from 'vitest'
import { noop, noopAsync } from './noop'

it('noop should return an empty function', () => {
  expect(noop()).toBeUndefined()
})

it('noopAsync should return an empty async function', async() => {
  expect(await noopAsync()).toBeUndefined()
})
