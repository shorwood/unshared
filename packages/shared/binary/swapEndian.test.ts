import { expect, it } from 'vitest'
import { swapEndian } from './swapEndian'

it('should swap endian of a 32-bit number', () => {
  expect(swapEndian(0x00001234)).toEqual(0x34120000)
  expect(swapEndian(0x12340000)).toEqual(0x00003412)
  expect(swapEndian(0x12345678)).toEqual(0x78563412)
})

it('should clamp to 32 bit', () => {
  expect(swapEndian(0x112345678)).toEqual(0x78563412)
})
