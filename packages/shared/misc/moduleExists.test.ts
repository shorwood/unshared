import { expect, it } from 'vitest'
import { moduleExists } from './moduleExists'

it('determines if a module exists safely', () => {
  expect(moduleExists('node:fs')).toEqual(true)
  expect(moduleExists('not-a-real-module')).toEqual(false)
})
