import { expect, it } from 'vitest'
import { randomString } from './randomString'

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
