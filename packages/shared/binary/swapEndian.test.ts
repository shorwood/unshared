import { expect, it } from 'vitest'
import { swapEndian } from './swapEndian'

it.each([
  [0x00001234, 0x34120000],
  [0x12340000, 0x00003412],
  [0x12345678, 0x78563412],
  [0x112345678, 0x78563412],
])('should swap endian of a 32-bit number %i', (input, expected) => {
  const result = swapEndian(input)
  expect(result).toEqual(expected)
})
