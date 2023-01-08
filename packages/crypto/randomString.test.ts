import { expect, it } from 'vitest'
import { randomString } from './randomString'

// it.each([
//   [undefined, undefined],
//   [8, '01'],
//   [8, '0123456789abcdef'],
//   [16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'],

//   [undefined, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'],
//   [16, { characters: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' }],
// ])('returns a random string of length "%s" with option "%s"', (length, options) => {
//   const result = randomString(length, <any>options)

//   const expectedChars = typeof options === 'string'
//     ? options
//     : options?.characters ?? '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
//   const expectedMatch = new RegExp(`^[${expectedChars}]+$`)

//   expect(result).toBeTypeOf('string')
//   expect(result.length).toEqual(length ?? 16)
//   expect(result).toMatch(expectedMatch)
// })

it('should return a random string with default options', () => {
  const result = randomString()
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(16)
  expect(result).toMatch(/^[\dA-Za-z]+$/)
})

it('should return a random string with custom length', () => {
  const result = randomString(8)
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(8)
  expect(result).toMatch(/^[\dA-Za-z]+$/)
})

it('should return a random string with custom characters', () => {
  const result = randomString(8, '01')
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(8)
  expect(result).toMatch(/^[01]+$/)
})

it('should return a random string with custom characters', () => {
  const result = randomString(8, { characters: '01' })
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(8)
  expect(result).toMatch(/^[01]+$/)
})
