import { expect, it } from 'vitest'
import { randomInt } from './randomInt'

it.each(Array.from({ length: 10 }))('returns a random Uint32 (#%#)', () => {
  const result = randomInt()
  expect(result).toBeTypeOf('number')
  expect(result).toBeGreaterThanOrEqual(0x00000000)
  expect(result).toBeLessThanOrEqual(0xFFFFFFFF)
  expect(Number.isInteger(result)).toEqual(true)
})
