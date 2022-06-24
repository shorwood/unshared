import { expect, it } from 'vitest'
import { getEndianness } from './getEndianness'

it('returns the endianness of the machine', () => {
  expect(getEndianness()).toMatch(/^(LE|BE)$/)
})
