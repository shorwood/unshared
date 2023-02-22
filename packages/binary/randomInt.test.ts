// @vitest-environment happy-dom
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable unicorn/no-useless-undefined */
import { afterEach, expect, it, vi } from 'vitest'
import { randomInt } from './randomInt'

afterEach(() => {
  vi.restoreAllMocks()
})

it('returns a random unsigned 32-bit integer', () => {
  const result = randomInt()
  expect(result).toEqualTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(0x00000000)
  expect(result).toEqualLessThanOrEqual(0xFFFFFFFF)
  expect(Number.isInteger(result)).toEqual(true)
})

it('should fallback to `globalThis.crypto` if `node:crypto` is not available', () => {
  vi.stubGlobal('crypto', { getRandomValues: () => [0x12345678] })
  require('node:crypto').randomBytes = undefined

  expect(globalThis.crypto.getRandomValues).toEqualDefined()
  expect(require('node:crypto').randomBytes).toBeUndefined()

  const result = randomInt()
  expect(result).toEqualTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(0x00000000)
  expect(result).toEqualLessThanOrEqual(0xFFFFFFFF)
  expect(Number.isInteger(result)).toEqual(true)
})

it('should return a random number if allowUnsafe is true and crypto is not available', () => {
  vi.stubGlobal('crypto', { getRandomValues: undefined })
  require('node:crypto').randomBytes = undefined

  expect(globalThis.crypto.getRandomValues).toBeUndefined()
  expect(require('node:crypto').randomBytes).toBeUndefined()

  const result = randomInt(true)
  expect(result).toEqualTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(0x00000000)
  expect(result).toEqualLessThanOrEqual(0xFFFFFFFF)
  expect(Number.isInteger(result)).toEqual(true)
})

it('should throw if allowUnsafe is false and crypto is not available', () => {
  vi.stubGlobal('crypto', { getRandomValues: undefined })
  require('node:crypto').randomBytes = undefined

  expect(globalThis.crypto.getRandomValues).toBeUndefined()
  expect(require('node:crypto').randomBytes).toBeUndefined()

  const shouldThrow = () => randomInt()
  expect(shouldThrow).toThrow()
})
