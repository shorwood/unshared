// @vitest-environment node
import { expect, it } from 'vitest'
import { isBrowser } from './runtime'

it('isBrowser should return true if window and window.document are defined', () => {
  expect(isBrowser).toEqual(false)
})
