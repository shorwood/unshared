/* eslint-disable @typescript-eslint/no-var-requires */
import { expect, it } from 'vitest'
import { importSafe } from './importSafe'

it('should should require an existing module', async() => {
  const result = await importSafe('node:path')
  const expected = await import('node:path')
  expect(result).toStrictEqual(expected)
})

it('should should not require a non-existing module', async() => {
  const result = await importSafe('not-a-real-module')
  expect(result).toBeUndefined()
})
