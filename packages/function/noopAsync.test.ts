import { expect, it } from 'vitest'
import { noopAsync } from './noopAsync'

it('noopAsync should return an empty async function', async() => {
  const result = await noopAsync()
  expect(result).toBeUndefined()
})
