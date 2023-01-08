/* eslint-disable @typescript-eslint/no-var-requires */
import { expect, it } from 'vitest'
import { requireSafe } from './requireSafe'

it('should should require an existing module', () => {
  const result = requireSafe('node:path')
  const expected = require('node:path')
  expect(result).toStrictEqual(expected)
})

it('should should not require a non-existing module', () => {
  const result = requireSafe('not-a-real-module')
  expect(result).toBeUndefined()
})
