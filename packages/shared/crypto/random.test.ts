import { expect, it } from 'vitest'
import { random, randomFloat, randomString } from './random'

it.each(Array.from({ length: 10 }))('returns a random Uint32 (#%#)', () => {
  const result = random()
  expect(result).toBeTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(0x00000000)
  expect(result).toBeLessThanOrEqual(0xFFFFFFFF)
  expect(Number.isInteger(result)).toEqual(true)
})

it.each(Array.from({ length: 10 }))('returns a random float between 0 and 1 (#%#)', () => {
  const result = randomFloat()
  expect(result).toBeTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(0)
  expect(result).toBeLessThanOrEqual(1)
})

it.each(Array.from({ length: 10 }))('returns a random float between min and max (#%#)', () => {
  const result = randomFloat(10, 20)
  expect(result).toBeTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(10)
  expect(result).toBeLessThanOrEqual(20)
})

it.each(Array.from({ length: 10 }))('returns a random alphanum string of length 16 (#%#)', () => {
  const result = randomString()
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(16)
  expect(result).toMatch(/^[\dA-Za-z]+$/)
})

it.each([
  [16, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'],
  [8, '0123456789abcdef'],
  [8, '01'],
])('returns a random string (#%#)', (n, chars) => {
  const result = randomString(n, chars)
  expect(result).toBeTypeOf('string')
  expect(result.length).toEqual(n)
  expect([...result].every(char => chars.includes(char))).toEqual(true)
})
