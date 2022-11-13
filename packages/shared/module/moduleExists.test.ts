import { expect, it } from 'vitest'
import { moduleExists } from './moduleExists'

it('should return true if the module exists', () => {
  const result = moduleExists('node:fs')
  expect(result).toEqual(true)
})

it('should return false if the module does not exist', () => {
  const result = moduleExists('not-a-real-module')
  expect(result).toEqual(false)
})
