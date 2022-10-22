import { expect, it } from 'vitest'
import { requireSafe } from './requireSafe'

it('requires a module, but doesn\'t throw an error if it fails', () => {
  expect(requireSafe('node:fs')).toBeDefined()
  expect(requireSafe('not-a-real-module')).toBeUndefined()
})
